import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

type SortKey =
  | "playerId"
  | "tier"
  | "totalGames"
  | "wins"
  | "losses"
  | "winRate"
  | "mainRace";
type SortOrder = "asc" | "desc";

const Container = styled.div`
  width: 100%;
`;

const SearchBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TierSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TierHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UpdateTime = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TierTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent.cyan};
    border-radius: 2px;
  }
`;

const TierTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.accent.cyan : theme.colors.background.tertiary};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.background.primary : theme.colors.text.secondary};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent.cyan : "rgba(255, 255, 255, 0.1)"};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.fontWeight.semibold : theme.fontWeight.normal};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.accent.cyan : theme.colors.background.secondary};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSize.md};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.cyan};
  }
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const TableHeaderCell = styled.th<{ $sortable?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $sortable, theme }) =>
      $sortable ? theme.colors.accent.cyan : theme.colors.text.secondary};
  }

  &:first-child {
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.spacing.lg};
  }
`;

const SortIcon = styled.span<{ $active: boolean; $direction: SortOrder }>`
  margin-left: 4px;
  display: inline-block;
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  transform: ${({ $direction }) =>
    $direction === "asc" ? "rotate(0deg)" : "rotate(180deg)"};
  transition: all 0.2s ease;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(87, 239, 214, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};

  &:first-child {
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.spacing.lg};
  }
`;

const PlayerNameCell = styled(TableCell)`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const RaceBadge = styled.span<{ $race: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ $race, theme }) => {
    const raceColors: Record<string, string> = theme.colors.race;
    return raceColors[$race] || theme.colors.text.tertiary;
  }};
  color: ${({ theme }) => theme.colors.background.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const WinRateCell = styled(TableCell)<{ $winRate: number }>`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ $winRate, theme }) =>
    $winRate >= 50 ? theme.colors.status.win : theme.colors.status.loss};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorContainer = styled(LoadingContainer)`
  color: ${({ theme }) => theme.colors.status.loss};
`;

export const PlayerList: React.FC = () => {
  const { playerSummaries, loading, error } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("전체");
  const [sortKey, setSortKey] = useState<SortKey>("totalGames");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const navigate = useNavigate();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedAndFilteredPlayers = useMemo(() => {
    let filtered = playerSummaries.filter((player) => {
      // 검색어 필터
      const matchesSearch = player.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 티어 필터
      const matchesTier =
        selectedTier === "전체" || player.tier === selectedTier;

      return matchesSearch && matchesTier;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortKey];
      let bValue: any = b[sortKey];

      // 문자열은 소문자로 변환
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      // 빈 값 처리
      if (!aValue && aValue !== 0)
        aValue = sortOrder === "asc" ? Infinity : -Infinity;
      if (!bValue && bValue !== 0)
        bValue = sortOrder === "asc" ? Infinity : -Infinity;

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [playerSummaries, searchQuery, selectedTier, sortKey, sortOrder]);

  if (loading) {
    return <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>;
  }

  if (error) {
    return (
      <ErrorContainer>데이터를 불러오는데 실패했습니다: {error}</ErrorContainer>
    );
  }

  const tiers = ["전체", "G", "0", "1", "2", "3", "4"];
  const updateTime =
    typeof __UPDATE_TIME__ !== "undefined" ? __UPDATE_TIME__ : "";

  return (
    <Container>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="선수 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>

      <TierSection>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TierTabs>
            {tiers.map((tier) => (
              <TierTab
                key={tier}
                $active={selectedTier === tier}
                onClick={() => setSelectedTier(tier)}
              >
                {tier}
              </TierTab>
            ))}
          </TierTabs>
          <TierHeader>
            <div></div>
            {updateTime && <UpdateTime>업데이트: {updateTime}</UpdateTime>}
          </TierHeader>
        </div>
      </TierSection>

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell $sortable onClick={() => handleSort("playerId")}>
                선수명
                <SortIcon
                  $active={sortKey === "playerId"}
                  $direction={sortOrder}
                >
                  ▲
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell $sortable onClick={() => handleSort("tier")}>
                티어
                <SortIcon $active={sortKey === "tier"} $direction={sortOrder}>
                  ▲
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell $sortable onClick={() => handleSort("mainRace")}>
                종족
                <SortIcon
                  $active={sortKey === "mainRace"}
                  $direction={sortOrder}
                >
                  ▲
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell
                $sortable
                onClick={() => handleSort("totalGames")}
              >
                경기 수
                <SortIcon
                  $active={sortKey === "totalGames"}
                  $direction={sortOrder}
                >
                  ▲
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell $sortable onClick={() => handleSort("wins")}>
                승
                <SortIcon $active={sortKey === "wins"} $direction={sortOrder}>
                  ▲
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell $sortable onClick={() => handleSort("losses")}>
                패
                <SortIcon $active={sortKey === "losses"} $direction={sortOrder}>
                  ▲
                </SortIcon>
              </TableHeaderCell>
              <TableHeaderCell $sortable onClick={() => handleSort("winRate")}>
                승률
                <SortIcon
                  $active={sortKey === "winRate"}
                  $direction={sortOrder}
                >
                  ▲
                </SortIcon>
              </TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {sortedAndFilteredPlayers.map((player) => (
              <TableRow
                key={player.playerId}
                onClick={() => navigate(`/player/${player.playerId}`)}
              >
                <PlayerNameCell>{player.displayName}</PlayerNameCell>
                <TableCell>{player.tier || "-"}</TableCell>
                <TableCell>
                  <RaceBadge $race={player.mainRace}>
                    {player.mainRace}
                  </RaceBadge>
                </TableCell>
                <TableCell>{player.totalGames}</TableCell>
                <TableCell>{player.wins}</TableCell>
                <TableCell>{player.losses}</TableCell>
                <WinRateCell $winRate={player.winRate}>
                  {player.winRate.toFixed(1)}%
                </WinRateCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
