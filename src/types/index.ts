// 경기 기록 타입
export interface MatchRecord {
  no: string;
  date: string;
  nameComp: string; // 대회 이름
  status: string;
  mType: string;
  round: string;
  map: string;
  points: string;
  idBattlenet1: string; // 선수1 ID (lowercase for comparison)
  idBattlenet1Original: string; // 선수1 ID (original casing for display)
  tier1: string;
  race1: string; // 선수1 종족
  rL1: string;
  rL2: string; // 1이면 선수1 승리
  rR2: string; // 1이면 선수2 승리
  rR1: string;
  idBattlenet2: string; // 선수2 ID (lowercase for comparison)
  idBattlenet2Original: string; // 선수2 ID (original casing for display)
  tier2: string;
  race2: string; // 선수2 종족
  pointsEnd: string;
  r: string; // 이긴 선수의 종족
  remark: string;
  remark2: string; // U열: AXL, AXPL, 개인전 등
}

// 카테고리별 통계
export interface CategoryStats {
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// 선수 통계 타입
export interface PlayerStats {
  playerId: string; // lowercase for comparison
  displayName: string; // original casing for display
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  raceUsage: Record<string, number>; // 종족별 사용 횟수
  mapStats: MapStats[];
  opponentStats: OpponentStats[];
  compStats: CompStats[];
  raceMatchupStats: RaceMatchupStats[]; // 종족전 통계
  recentMatches: MatchRecord[];
  // 주요 대회별 통계
  axlStats: CategoryStats; // AX 리그 성적
  axplStats: CategoryStats; // 프로리그 성적
  soloStats: CategoryStats; // 개인전 성적
}

// 맵별 통계
export interface MapStats {
  map: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// 상대 전적
export interface OpponentStats {
  opponentId: string; // lowercase for comparison
  opponentDisplayName: string; // original casing for display
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// 대회별 통계
export interface CompStats {
  compName: string;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// 종족전 통계
export interface RaceMatchupStats {
  vsRace: string; // 상대 종족 (T, P, Z)
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// 선수 목록용 요약 정보
export interface PlayerSummary {
  playerId: string; // lowercase for comparison
  displayName: string; // original casing for display
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  mainRace: string;
  tier: string;
}

// 맵별 종족 매치업 통계
export interface MapMatchupStats {
  matchup: string; // 예: "TvP", "TvZ", "PvZ"
  wins: number; // 첫 번째 종족 승리 수
  losses: number; // 두 번째 종족 승리 수
  total: number;
  winRate: number; // 첫 번째 종족 승률
}

// 맵 통계 (종족전 포함)
export interface MapStatistics {
  map: string;
  totalGames: number;
  matchups: MapMatchupStats[]; // TvP, TvZ, PvZ
}
