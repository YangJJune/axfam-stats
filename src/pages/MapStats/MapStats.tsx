import React, { useState } from "react";
import styled from "styled-components";
import { useData } from "../../context/DataContext";
import { getMapInfo } from "../../config/mapConfig";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const MapThumbnailsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: ${({ theme }) => theme.spacing.sm} 0;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent.cyan};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.accent.blue};
  }
`;

const MapThumbnailWrapper = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.sm};
`;

const MapThumbnail = styled.div<{ $active: boolean }>`
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ThumbnailImageContainer = styled.div<{ $active: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent.cyan : "rgba(255, 255, 255, 0.2)"};
  background: ${({ theme }) => theme.colors.background.tertiary};
  transition: border-color 0.2s ease;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
  background: linear-gradient(135deg, #27282e 0%, #1e1f24 100%);
`;

const MapThumbnailName = styled.div<{ $active: boolean }>`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent.cyan : theme.colors.text.tertiary};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.fontWeight.semibold : theme.fontWeight.normal};
  max-width: 80px;
  white-space: normal;
  word-break: keep-all;
`;

const MapDetailCard = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const MapDetailHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const MapDetailName = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const TotalGames = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const MatchupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MatchupCard = styled.div<{ $isMirror: boolean }>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  ${({ $isMirror }) => $isMirror && "opacity: 0.7;"}
`;

const MatchupTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.accent.cyan};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const MatchupStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RaceInfo = styled.div`
  flex: 1;
`;

const RaceName = styled.div<{ $race: string }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ $race, theme }) => theme.colors.race[$race as "T" | "P" | "Z"]};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RaceWins = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Separator = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const WinRatesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const WinRateBox = styled.div`
  text-align: center;
`;

const WinRateLabel = styled.div<{ $race: string }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ $race, theme }) => theme.colors.race[$race as "T" | "P" | "Z"]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const WinRateValue = styled.div<{ $winRate: number }>`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $winRate, theme }) =>
    $winRate >= 50 ? theme.colors.accent.cyan : theme.colors.status.loss};
`;

const MirrorMatchupInfo = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const MirrorMatchupLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MirrorMatchupValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const MapStats: React.FC = () => {
  const { mapStatistics, loading } = useData();
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (loading) {
    return <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>;
  }

  if (mapStatistics.length === 0) {
    return <LoadingContainer>맵 통계가 없습니다.</LoadingContainer>;
  }

  const selectedMap = mapStatistics[selectedMapIndex];
  const selectedMapInfo = getMapInfo(selectedMap.map);

  // 매치업이 동족전인지 확인
  const isMirrorMatchup = (matchup: string): boolean => {
    return matchup === "PvP" || matchup === "TvT" || matchup === "ZvZ";
  };

  // 매치업 이름을 종족으로 분리하는 함수
  const getMatchupRaces = (matchup: string): [string, string] => {
    const race1 = matchup[0];
    const race2 = matchup[2];
    return [race1, race2];
  };

  const handleImageError = (mapCode: string) => {
    setImageErrors((prev) => ({ ...prev, [mapCode]: true }));
  };

  return (
    <Container>
      <Header>
        <Title>맵 통계</Title>
      </Header>

      <MapThumbnailsContainer>
        <MapThumbnailWrapper>
          {mapStatistics.map((mapStat, index) => {
            const mapInfo = getMapInfo(mapStat.map);
            const hasError = imageErrors[mapStat.map];

            return (
              <MapThumbnail
                key={mapStat.map}
                $active={selectedMapIndex === index}
                onClick={() => setSelectedMapIndex(index)}
              >
                <ThumbnailImageContainer $active={selectedMapIndex === index}>
                  {mapInfo.thumbnail && !hasError ? (
                    <ThumbnailImage
                      src={mapInfo.thumbnail}
                      alt={mapInfo.name}
                      onError={() => handleImageError(mapStat.map)}
                    />
                  ) : (
                    <ThumbnailPlaceholder>🗺️</ThumbnailPlaceholder>
                  )}
                </ThumbnailImageContainer>
                <MapThumbnailName $active={selectedMapIndex === index}>
                  {mapInfo.name}
                </MapThumbnailName>
              </MapThumbnail>
            );
          })}
        </MapThumbnailWrapper>
      </MapThumbnailsContainer>

      <MapDetailCard>
        <MapDetailHeader>
          <MapDetailName>{selectedMapInfo.name}</MapDetailName>
          <TotalGames>총 {selectedMap.totalGames}경기</TotalGames>
        </MapDetailHeader>

        <MatchupsGrid>
          {selectedMap.matchups.map((matchup) => {
            const [race1, race2] = getMatchupRaces(matchup.matchup);
            const isMirror = isMirrorMatchup(matchup.matchup);

            return (
              <MatchupCard key={matchup.matchup} $isMirror={isMirror}>
                <MatchupTitle>{matchup.matchup}</MatchupTitle>

                {isMirror ? (
                  <MirrorMatchupInfo>
                    <MirrorMatchupLabel>동족전</MirrorMatchupLabel>
                    <MirrorMatchupValue>{matchup.total}경기</MirrorMatchupValue>
                  </MirrorMatchupInfo>
                ) : (
                  <>
                    <MatchupStats>
                      <RaceInfo>
                        <RaceName $race={race1}>{race1}</RaceName>
                        <RaceWins>{matchup.wins}승</RaceWins>
                      </RaceInfo>
                      <Separator>:</Separator>
                      <RaceInfo style={{ textAlign: "right" }}>
                        <RaceName $race={race2}>{race2}</RaceName>
                        <RaceWins>{matchup.losses}승</RaceWins>
                      </RaceInfo>
                    </MatchupStats>
                    <WinRatesContainer>
                      <WinRateBox>
                        <WinRateLabel $race={race1}>{race1} 승률</WinRateLabel>
                        <WinRateValue $winRate={matchup.winRate}>
                          {matchup.winRate.toFixed(1)}%
                        </WinRateValue>
                      </WinRateBox>
                      <WinRateBox>
                        <WinRateLabel $race={race2}>{race2} 승률</WinRateLabel>
                        <WinRateValue $winRate={100 - matchup.winRate}>
                          {(100 - matchup.winRate).toFixed(1)}%
                        </WinRateValue>
                      </WinRateBox>
                    </WinRatesContainer>
                  </>
                )}
              </MatchupCard>
            );
          })}
        </MatchupsGrid>
      </MapDetailCard>
    </Container>
  );
};
