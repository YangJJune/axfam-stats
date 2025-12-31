import React, { createContext, useContext, useEffect, useState } from 'react';
import type { MatchRecord, PlayerStats, PlayerSummary, MapStatistics } from '../types';
import { parseCSV, calculatePlayerStats, getPlayerSummaries, calculateMapStatistics } from '../utils/dataParser';

interface DataContextType {
  records: MatchRecord[];
  playerStats: Map<string, PlayerStats>;
  playerSummaries: PlayerSummary[];
  mapStatistics: MapStatistics[];
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MatchRecord[]>([]);
  const [playerStats, setPlayerStats] = useState<Map<string, PlayerStats>>(new Map());
  const [playerSummaries, setPlayerSummaries] = useState<PlayerSummary[]>([]);
  const [mapStatistics, setMapStatistics] = useState<MapStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Cache busting: 빌드 타임스탬프 사용 (프로덕션) 또는 현재 시간 (개발)
        const timestamp = typeof __BUILD_TIMESTAMP__ !== 'undefined'
          ? __BUILD_TIMESTAMP__
          : new Date().getTime();

        // Load tier data
        const tierResponse = await fetch(`/tier.csv?v=${timestamp}`);
        const tierText = await tierResponse.text();
        const tierMap = new Map<string, string>();

        const tierLines = tierText.split('\n');
        for (let i = 1; i < tierLines.length; i++) {
          const line = tierLines[i].trim();
          if (!line || line === ',') continue;

          const [id, tier] = line.split(',');
          if (id && tier) {
            tierMap.set(id.toLowerCase(), tier);
          }
        }

        // Load match data
        const data = await parseCSV(`/data.csv?v=${timestamp}`);
        setRecords(data);

        const stats = calculatePlayerStats(data);
        setPlayerStats(stats);

        const summaries = getPlayerSummaries(stats, tierMap);
        setPlayerSummaries(summaries);

        const mapStats = calculateMapStatistics(data);
        setMapStatistics(mapStats);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        records,
        playerStats,
        playerSummaries,
        mapStatistics,
        loading,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
