import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { WinRateChart } from "../../components/WinRateChart/WinRateChart";
import { MapCard } from "../../components/MapCard/MapCard";
import type { MatchRecord } from "../../types";

const Container = styled.div`
  width: 100%;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent.cyan};
  }
`;

const PlayerBanner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, #1a1b1f 0%, #27282e 100%);
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
`;

const BannerOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    transparent 100%
  );
`;

const PlayerName = styled.h1`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
`;

const PlayerHeader = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TotalStatsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const TotalStatsInfo = styled.div`
  flex: 1;
`;

// const TotalStatsChart = styled.div`
//   flex-shrink: 0;
// `;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent.cyan : theme.colors.text.secondary};
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent.cyan : "transparent"};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent.cyan};
  }
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
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

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSize.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.cyan};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(87, 239, 214, 0.05);
  }
`;

const ExpandedContent = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const MatchHistoryTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const MatchHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent.cyan};
    border-radius: 3px;
  }
`;

const MatchHistoryItem = styled.div<{ $isWin: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-left: 3px solid
    ${({ $isWin, theme }) =>
      $isWin ? theme.colors.accent.cyan : theme.colors.status.loss};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MatchDate = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const MatchComp = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const MatchMap = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MatchResult = styled.span<{ $isWin: boolean }>`
  color: ${({ $isWin, theme }) =>
    $isWin ? theme.colors.accent.cyan : theme.colors.status.loss};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  max-height: 600px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent.cyan};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.accent.blue};
  }
`;

export const PlayerDetail: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const { playerStats, records } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "maps" | "opponents" | "comps" | "races"
  >("maps");
  const [opponentSearch, setOpponentSearch] = useState("");
  const [expandedOpponent, setExpandedOpponent] = useState<string | null>(null);
  const [profileImageError, setProfileImageError] = useState(false);

  const playerStat = playerId ? playerStats.get(playerId) : null;

  // 선수가 바뀔 때 프로필 이미지 에러 상태 초기화
  useEffect(() => {
    setProfileImageError(false);
  }, [playerId]);

  if (!playerStat) {
    return <LoadingContainer>선수 정보를 찾을 수 없습니다.</LoadingContainer>;
  }

  // 주 종족 찾기
  let mainRace = "";
  console.log(mainRace);
  let maxCount = 0;
  Object.entries(playerStat.raceUsage).forEach(([race, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mainRace = race;
    }
  });

  // 필터링된 상대 전적
  const filteredOpponents = useMemo(() => {
    if (!opponentSearch.trim()) {
      return playerStat.opponentStats;
    }
    return playerStat.opponentStats.filter((opp) =>
      opp.opponentDisplayName
        .toLowerCase()
        .includes(opponentSearch.toLowerCase())
    );
  }, [playerStat.opponentStats, opponentSearch]);

  // 특정 상대와의 매치 기록 가져오기
  const getMatchesWithOpponent = (opponentId: string): MatchRecord[] => {
    return records
      .filter((record) => {
        const isPlayer1 = record.idBattlenet1 === playerId;
        const isPlayer2 = record.idBattlenet2 === playerId;
        const isOpponent1 = record.idBattlenet1 === opponentId;
        const isOpponent2 = record.idBattlenet2 === opponentId;

        return (isPlayer1 && isOpponent2) || (isPlayer2 && isOpponent1);
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // 최신순 정렬
  };

  // 매치 결과 판정
  const isPlayerWin = (record: MatchRecord): boolean => {
    if (record.idBattlenet1 === playerId) {
      return record.rL2 === "1";
    } else {
      return record.rR2 === "1";
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate("/")}>
        ← 선수 목록으로 돌아가기
      </BackButton>

      <PlayerBanner>
        {!profileImageError && (
          <BannerImage
            src={`/profile/${encodeURIComponent(
              playerStat.playerId.substring(0, playerStat.playerId.length - 3)
            )}.png`}
            alt={playerStat.displayName}
            onError={() => setProfileImageError(true)}
          />
        )}
        <BannerOverlay>
          <PlayerName>{playerStat.displayName}</PlayerName>
        </BannerOverlay>
      </PlayerBanner>

      <PlayerHeader>
        <TotalStatsSection>
          <TotalStatsInfo>
            <StatsGrid>
              <StatBox>
                <StatLabel>총 경기</StatLabel>
                <StatValue>{playerStat.totalGames}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>승</StatLabel>
                <StatValue>{playerStat.wins}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>패</StatLabel>
                <StatValue>{playerStat.losses}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>승률</StatLabel>
                <StatValue>{playerStat.winRate.toFixed(1)}%</StatValue>
              </StatBox>
            </StatsGrid>
          </TotalStatsInfo>
          {/* <TotalStatsChart>
            <WinRateChart
              wins={playerStat.wins}
              losses={playerStat.losses}
              size={160}
            />
          </TotalStatsChart> */}
        </TotalStatsSection>

        <StatsGrid>
          <StatBox>
            <StatLabel>총 전적</StatLabel>
            <WinRateChart
              wins={playerStat.wins}
              losses={playerStat.losses}
              size={140}
            />
          </StatBox>
          <StatBox>
            <StatLabel>프로리그</StatLabel>
            <WinRateChart
              wins={playerStat.axplStats.wins}
              losses={playerStat.axplStats.losses}
              size={140}
            />
          </StatBox>
          <StatBox>
            <StatLabel>커피리그</StatLabel>
            <WinRateChart
              wins={playerStat.coffeeStats.wins}
              losses={playerStat.coffeeStats.losses}
              size={140}
            />
          </StatBox>
          <StatBox>
            <StatLabel>종족최강전</StatLabel>
            <WinRateChart
              wins={playerStat.racechampStats.wins}
              losses={playerStat.racechampStats.losses}
              size={140}
            />
          </StatBox>
        </StatsGrid>
      </PlayerHeader>

      <Tabs>
        <Tab
          $active={activeTab === "maps"}
          onClick={() => setActiveTab("maps")}
        >
          맵별 전적
        </Tab>
        <Tab
          $active={activeTab === "opponents"}
          onClick={() => setActiveTab("opponents")}
        >
          상대 전적
        </Tab>
        <Tab
          $active={activeTab === "races"}
          onClick={() => setActiveTab("races")}
        >
          종족전
        </Tab>
        <Tab
          $active={activeTab === "comps"}
          onClick={() => setActiveTab("comps")}
        >
          대회별 전적
        </Tab>
      </Tabs>

      {activeTab === "maps" && (
        <ContentCard>
          <CardTitle>맵별 전적</CardTitle>
          <MapGrid>
            {playerStat.mapStats.map((mapStat) => (
              <MapCard key={mapStat.map} mapStat={mapStat} />
            ))}
          </MapGrid>
        </ContentCard>
      )}

      {activeTab === "opponents" && (
        <ContentCard>
          <CardTitle>상대 전적</CardTitle>
          <SearchInput
            type="text"
            placeholder="상대 선수 검색..."
            value={opponentSearch}
            onChange={(e) => setOpponentSearch(e.target.value)}
          />
          <Table>
            <thead>
              <TableRow>
                <TableHeader>상대</TableHeader>
                <TableHeader>경기 수</TableHeader>
                <TableHeader>승</TableHeader>
                <TableHeader>패</TableHeader>
                <TableHeader>승률</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {filteredOpponents.slice(0, 20).map((oppStat) => {
                const isExpanded = expandedOpponent === oppStat.opponentId;
                const matches = isExpanded
                  ? getMatchesWithOpponent(oppStat.opponentId)
                  : [];

                return (
                  <React.Fragment key={oppStat.opponentId}>
                    <ClickableTableRow
                      onClick={() =>
                        setExpandedOpponent(
                          isExpanded ? null : oppStat.opponentId
                        )
                      }
                    >
                      <TableCell>{oppStat.opponentDisplayName}</TableCell>
                      <TableCell>{oppStat.total}</TableCell>
                      <TableCell>{oppStat.wins}</TableCell>
                      <TableCell>{oppStat.losses}</TableCell>
                      <WinRateCell $winRate={oppStat.winRate}>
                        {oppStat.winRate.toFixed(1)}%
                      </WinRateCell>
                    </ClickableTableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5} style={{ padding: 0 }}>
                          <ExpandedContent>
                            <MatchHistoryTitle>
                              {oppStat.opponentDisplayName}와의 매치 기록
                            </MatchHistoryTitle>
                            <MatchHistoryList>
                              {matches.map((match, index) => {
                                const isWin = isPlayerWin(match);
                                return (
                                  <MatchHistoryItem key={index} $isWin={isWin}>
                                    <MatchDate>{match.date}</MatchDate>
                                    <MatchComp>{match.nameComp}</MatchComp>
                                    <MatchMap>{match.map}</MatchMap>
                                    <MatchResult $isWin={isWin}>
                                      {isWin ? "승리" : "패배"}
                                    </MatchResult>
                                  </MatchHistoryItem>
                                );
                              })}
                            </MatchHistoryList>
                          </ExpandedContent>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </ContentCard>
      )}

      {activeTab === "races" && (
        <ContentCard>
          <CardTitle>종족전 전적</CardTitle>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>vs 종족</TableHeader>
                <TableHeader>경기 수</TableHeader>
                <TableHeader>승</TableHeader>
                <TableHeader>패</TableHeader>
                <TableHeader>승률</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {playerStat.raceMatchupStats.map((raceStat) => (
                <TableRow key={raceStat.vsRace}>
                  <TableCell>vs {raceStat.vsRace}</TableCell>
                  <TableCell>{raceStat.total}</TableCell>
                  <TableCell>{raceStat.wins}</TableCell>
                  <TableCell>{raceStat.losses}</TableCell>
                  <WinRateCell $winRate={raceStat.winRate}>
                    {raceStat.winRate.toFixed(1)}%
                  </WinRateCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </ContentCard>
      )}

      {activeTab === "comps" && (
        <ContentCard>
          <CardTitle>대회별 전적</CardTitle>
          <Table>
            <thead>
              <TableRow>
                <TableHeader>대회</TableHeader>
                <TableHeader>경기 수</TableHeader>
                <TableHeader>승</TableHeader>
                <TableHeader>패</TableHeader>
                <TableHeader>승률</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {playerStat.compStats.slice(0, 20).map((compStat) => (
                <TableRow key={compStat.compName}>
                  <TableCell>{compStat.compName}</TableCell>
                  <TableCell>{compStat.total}</TableCell>
                  <TableCell>{compStat.wins}</TableCell>
                  <TableCell>{compStat.losses}</TableCell>
                  <WinRateCell $winRate={compStat.winRate}>
                    {compStat.winRate.toFixed(1)}%
                  </WinRateCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </ContentCard>
      )}
    </Container>
  );
};
