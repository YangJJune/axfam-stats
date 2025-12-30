import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import type { MapStats } from "../../types";
import { getMapInfo } from "../../config/mapConfig";

interface MapCardProps {
  mapStat: MapStats;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.cyan};
    transform: translateY(-2px);
  }
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  height: 240px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  position: relative;
  overflow: hidden;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderThumbnail = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xxl};
  color: ${({ theme }) => theme.colors.text.disabled};
  background: linear-gradient(135deg, #27282e 0%, #1e1f24 100%);
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const MapName = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

// const MapCode = styled.div`
//   font-size: ${({ theme }) => theme.fontSize.xs};
//   color: ${({ theme }) => theme.colors.text.tertiary};
//   margin-bottom: ${({ theme }) => theme.spacing.md};
// `;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Record = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const WinRate = styled.div<{ $winRate: number }>`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $winRate, theme }) =>
    $winRate >= 50 ? theme.colors.accent.cyan : theme.colors.status.loss};
`;

export const MapCard: React.FC<MapCardProps> = ({ mapStat }) => {
  const mapInfo = getMapInfo(mapStat.map);
  const [imageError, setImageError] = React.useState(false);
  const navigate = useNavigate();
  const { playerId } = useParams<{ playerId: string }>();

  const handleClick = () => {
    if (playerId) {
      navigate(`/player/${playerId}/map/${mapStat.map}`);
    }
  };

  return (
    <Card onClick={handleClick}>
      <ThumbnailContainer>
        {mapInfo.thumbnail && !imageError ? (
          <Thumbnail
            src={mapInfo.thumbnail}
            alt={mapInfo.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderThumbnail>🗺️</PlaceholderThumbnail>
        )}
      </ThumbnailContainer>
      <CardContent>
        <MapName>{mapInfo.name}</MapName>
        {/* {mapInfo.code !== mapInfo.name && <MapCode>{mapInfo.code}</MapCode>} */}
        <StatsRow>
          <Record>
            {mapStat.wins}승 {mapStat.losses}패 ({mapStat.total}경기)
          </Record>
          <WinRate $winRate={mapStat.winRate}>
            {mapStat.winRate.toFixed(1)}%
          </WinRate>
        </StatsRow>
      </CardContent>
    </Card>
  );
};
