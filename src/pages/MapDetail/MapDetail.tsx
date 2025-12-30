import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { getMapInfo } from "../../config/mapConfig";
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

const Header = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MapBanner = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #1a1b1f 0%, #27282e 100%);
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const MapTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const MapStatsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const MapStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MatchItem = styled.div<{ $isWin: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $isWin }) =>
    $isWin
      ? "linear-gradient(90deg, rgba(87, 239, 214, 0.1) 0%, transparent 100%)"
      : "linear-gradient(90deg, rgba(239, 87, 87, 0.1) 0%, transparent 100%)"};
  border: 1px solid
    ${({ $isWin }) =>
      $isWin ? "rgba(87, 239, 214, 0.2)" : "rgba(239, 87, 87, 0.2)"};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ $isWin, theme }) =>
      $isWin ? theme.colors.accent.cyan : theme.colors.status.loss};
    transform: translateX(4px);
  }
`;

const MatchResult = styled.div<{ $isWin: boolean }>`
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isWin, theme }) =>
    $isWin ? theme.colors.accent.cyan : theme.colors.status.loss};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.background.primary};
`;

const MatchInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MatchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const MatchPlayers = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PlayerName = styled.span<{ $isCurrentPlayer?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ $isCurrentPlayer, theme }) =>
    $isCurrentPlayer ? theme.fontWeight.bold : theme.fontWeight.medium};
  color: ${({ $isCurrentPlayer, theme }) =>
    $isCurrentPlayer ? theme.colors.accent.cyan : theme.colors.text.primary};
`;

const VsText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const MatchDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const MatchComp = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const MatchDate = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MapDetail: React.FC = () => {
  const { playerId, mapCode } = useParams<{
    playerId: string;
    mapCode: string;
  }>();
  const { playerStats, records } = useData();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const playerStat = playerId ? playerStats.get(playerId) : null;
  const mapInfo = mapCode ? getMapInfo(mapCode) : null;

  // 페이지 이동 시 스크롤을 최상단으로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [playerId, mapCode]);

  if (!playerStat || !mapInfo) {
    return <LoadingContainer>데이터를 찾을 수 없습니다.</LoadingContainer>;
  }

  // 해당 맵에서의 매치 기록 가져오기
  const mapMatches = records
    .filter((record) => {
      const isPlayer =
        record.idBattlenet1 === playerId || record.idBattlenet2 === playerId;
      const isMap = record.map === mapCode;
      return isPlayer && isMap;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // 매치 결과 판정
  const isPlayerWin = (record: MatchRecord): boolean => {
    if (record.idBattlenet1 === playerId) {
      return record.rL2 === "1";
    } else {
      return record.rR2 === "1";
    }
  };

  // 상대 선수 정보 가져오기
  const getOpponentInfo = (record: MatchRecord) => {
    if (record.idBattlenet1 === playerId) {
      return {
        name: record.idBattlenet2Original,
        race: record.race2,
      };
    } else {
      return {
        name: record.idBattlenet1Original,
        race: record.race1,
      };
    }
  };

  // 현재 선수 정보 가져오기
  const getPlayerInfo = (record: MatchRecord) => {
    if (record.idBattlenet1 === playerId) {
      return {
        name: record.idBattlenet1Original,
        race: record.race1,
      };
    } else {
      return {
        name: record.idBattlenet2Original,
        race: record.race2,
      };
    }
  };

  const mapStat = playerStat.mapStats.find((m) => m.map === mapCode);
  const wins = mapStat?.wins || 0;
  const losses = mapStat?.losses || 0;
  const total = mapStat?.total || 0;
  const winRate = mapStat?.winRate || 0;

  return (
    <Container>
      <BackButton onClick={() => navigate(`/player/${playerId}`)}>
        ← {playerStat.displayName} 페이지로 돌아가기
      </BackButton>

      <Header>
        <MapBanner>
          {mapInfo.thumbnail && !imageError ? (
            <BannerImage
              src={mapInfo.thumbnail}
              alt={mapInfo.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                background: "linear-gradient(135deg, #1a1b1f 0%, #27282e 100%)",
              }}
            >
              🗺️
            </div>
          )}
          <BannerOverlay>
            <MapTitle>{mapInfo.name}</MapTitle>
          </BannerOverlay>
        </MapBanner>
        <MapStatsContainer>
          <MapStats>
            <StatItem>
              <StatLabel>총 경기</StatLabel>
              <StatValue>{total}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>승</StatLabel>
              <StatValue>{wins}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>패</StatLabel>
              <StatValue>{losses}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>승률</StatLabel>
              <StatValue>{winRate.toFixed(1)}%</StatValue>
            </StatItem>
          </MapStats>
        </MapStatsContainer>
      </Header>

      <ContentCard>
        <CardTitle>매치 기록</CardTitle>
        <MatchList>
          {mapMatches.map((match, index) => {
            const isWin = isPlayerWin(match);
            const opponent = getOpponentInfo(match);
            const player = getPlayerInfo(match);

            return (
              <MatchItem key={index} $isWin={isWin}>
                <MatchResult $isWin={isWin}>{isWin ? "승" : "패"}</MatchResult>
                <MatchInfo>
                  <MatchHeader>
                    <MatchPlayers>
                      <PlayerName $isCurrentPlayer>
                        {player.name} ({player.race})
                      </PlayerName>
                      <VsText>vs</VsText>
                      <PlayerName>
                        {opponent.name} ({opponent.race})
                      </PlayerName>
                    </MatchPlayers>
                  </MatchHeader>
                  <MatchDetails>
                    <MatchComp>{match.nameComp}</MatchComp>
                    <MatchDate>{match.date}</MatchDate>
                  </MatchDetails>
                </MatchInfo>
              </MatchItem>
            );
          })}
        </MatchList>
      </ContentCard>
    </Container>
  );
};
