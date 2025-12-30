import Papa from "papaparse";
import type {
  MatchRecord,
  PlayerStats,
  PlayerSummary,
  MapStats,
  OpponentStats,
  CompStats,
  RaceMatchupStats,
  CategoryStats,
  MapStatistics,
  MapMatchupStats,
} from "../types";

// CSV를 MatchRecord 배열로 파싱
export const parseCSV = async (filePath: string): Promise<MatchRecord[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const records: MatchRecord[] = results.data.map((row: any) => {
          const id1Original = (row["ID.BATTLENET1"] || "").trim();
          const id2Original = (row["ID.BATTLENET2"] || "").trim();

          return {
            no: row["No"] || "",
            date: row["DATE"] || "",
            nameComp: row["NAME.COMP"] || "",
            status: row["STATUS"] || "",
            mType: row["M.Type"] || "",
            round: row["ROUND"] || "",
            map: (row["MAP"] || "").trim().toLowerCase(), // 맵 코드를 소문자로 변환
            points: row["points"] || "",
            idBattlenet1: id1Original.toLowerCase(), // 비교/검색용 소문자 ID
            idBattlenet1Original: id1Original, // 표시용 원본 ID
            tier1: row["Tier1"] || "",
            race1: (row["RACE1"] || "").trim(),
            rL1: row["R.L1"] || "",
            rL2: row["R.L2"] || "",
            rR2: row["R.R2"] || "",
            rR1: row["R.R1"] || "",
            idBattlenet2: id2Original.toLowerCase(), // 비교/검색용 소문자 ID
            idBattlenet2Original: id2Original, // 표시용 원본 ID
            tier2: row["Tier2"] || "",
            race2: (row["RACE2"] || "").trim(),
            pointsEnd: row["R"] || "",
            r: (row["R"] || "").trim(),
            remark: row["REMARK"] || "",
            remark2: (row["REMARK2"] || "").trim(),
          };
        });
        resolve(records.filter((r) => r.idBattlenet1 && r.idBattlenet2));
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// 승자 판정
const getWinner = (record: MatchRecord): 1 | 2 | null => {
  if (record.rL2 === "1") return 1;
  if (record.rR2 === "1") return 2;
  return null;
};

// 선수별 통계 계산
export const calculatePlayerStats = (
  records: MatchRecord[]
): Map<string, PlayerStats> => {
  const statsMap = new Map<string, PlayerStats>();

  // 모든 선수 초기화 및 원본 이름 추적
  const allPlayers = new Map<string, string>(); // lowercase ID -> original ID
  records.forEach((record) => {
    if (record.idBattlenet1 && !allPlayers.has(record.idBattlenet1)) {
      allPlayers.set(record.idBattlenet1, record.idBattlenet1Original);
    }
    if (record.idBattlenet2 && !allPlayers.has(record.idBattlenet2)) {
      allPlayers.set(record.idBattlenet2, record.idBattlenet2Original);
    }
  });

  allPlayers.forEach((displayName, playerId) => {
    statsMap.set(playerId, {
      playerId,
      displayName,
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      raceUsage: {},
      mapStats: [],
      opponentStats: [],
      compStats: [],
      raceMatchupStats: [],
      recentMatches: [],
      axlStats: { wins: 0, losses: 0, total: 0, winRate: 0 },
      axplStats: { wins: 0, losses: 0, total: 0, winRate: 0 },
      soloStats: { wins: 0, losses: 0, total: 0, winRate: 0 },
    });
  });

  // 각 경기를 순회하며 통계 수집
  records.forEach((record) => {
    const winner = getWinner(record);

    // 선수1 통계
    if (record.idBattlenet1) {
      const stats = statsMap.get(record.idBattlenet1)!;
      stats.totalGames++;

      // 종족 사용 횟수
      if (record.race1) {
        stats.raceUsage[record.race1] =
          (stats.raceUsage[record.race1] || 0) + 1;
      }

      // 승패 기록
      if (winner === 1) {
        stats.wins++;
      } else if (winner === 2) {
        stats.losses++;
      }

      stats.recentMatches.push(record);
    }

    // 선수2 통계
    if (record.idBattlenet2) {
      const stats = statsMap.get(record.idBattlenet2)!;
      stats.totalGames++;

      // 종족 사용 횟수
      if (record.race2) {
        stats.raceUsage[record.race2] =
          (stats.raceUsage[record.race2] || 0) + 1;
      }

      // 승패 기록
      if (winner === 2) {
        stats.wins++;
      } else if (winner === 1) {
        stats.losses++;
      }

      stats.recentMatches.push(record);
    }
  });

  // 승률 계산 및 상세 통계 생성
  statsMap.forEach((stats, playerId) => {
    stats.winRate =
      stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0;

    // 최근 경기 정렬 (최신순)
    stats.recentMatches.sort((a, b) => b.date.localeCompare(a.date));
    stats.recentMatches = stats.recentMatches.slice(0, 20);

    // 맵별 통계 계산
    stats.mapStats = calculateMapStats(playerId, records);

    // 상대 전적 계산
    stats.opponentStats = calculateOpponentStats(playerId, records);

    // 대회별 통계 계산
    stats.compStats = calculateCompStats(playerId, records);

    // 종족전 통계 계산
    stats.raceMatchupStats = calculateRaceMatchupStats(playerId, records);

    // 카테고리별 통계 계산 (REMARK2 필드 기준)
    stats.axlStats = calculateCategoryStats(playerId, records, "AXL");
    stats.axplStats = calculateCategoryStats(playerId, records, "AXPL");
    stats.soloStats = calculateCategoryStats(playerId, records, "개인전");
  });

  return statsMap;
};

// 맵별 통계 계산
const calculateMapStats = (
  playerId: string,
  records: MatchRecord[]
): MapStats[] => {
  const mapStatsMap = new Map<string, { wins: number; losses: number }>();

  records.forEach((record) => {
    const winner = getWinner(record);
    if (!record.map) return;

    if (record.idBattlenet1 === playerId) {
      if (!mapStatsMap.has(record.map)) {
        mapStatsMap.set(record.map, { wins: 0, losses: 0 });
      }
      const mapStat = mapStatsMap.get(record.map)!;
      if (winner === 1) mapStat.wins++;
      else if (winner === 2) mapStat.losses++;
    }

    if (record.idBattlenet2 === playerId) {
      if (!mapStatsMap.has(record.map)) {
        mapStatsMap.set(record.map, { wins: 0, losses: 0 });
      }
      const mapStat = mapStatsMap.get(record.map)!;
      if (winner === 2) mapStat.wins++;
      else if (winner === 1) mapStat.losses++;
    }
  });

  const mapStats: MapStats[] = [];
  mapStatsMap.forEach((stat, map) => {
    const total = stat.wins + stat.losses;
    mapStats.push({
      map,
      wins: stat.wins,
      losses: stat.losses,
      total,
      winRate: total > 0 ? (stat.wins / total) * 100 : 0,
    });
  });

  return mapStats.sort((a, b) => b.total - a.total);
};

// 상대 전적 계산
const calculateOpponentStats = (
  playerId: string,
  records: MatchRecord[]
): OpponentStats[] => {
  const opponentStatsMap = new Map<
    string,
    { wins: number; losses: number; displayName: string }
  >();

  records.forEach((record) => {
    const winner = getWinner(record);

    if (record.idBattlenet1 === playerId && record.idBattlenet2) {
      const opponent = record.idBattlenet2;
      if (!opponentStatsMap.has(opponent)) {
        opponentStatsMap.set(opponent, {
          wins: 0,
          losses: 0,
          displayName: record.idBattlenet2Original,
        });
      }
      const oppStat = opponentStatsMap.get(opponent)!;
      if (winner === 1) oppStat.wins++;
      else if (winner === 2) oppStat.losses++;
    }

    if (record.idBattlenet2 === playerId && record.idBattlenet1) {
      const opponent = record.idBattlenet1;
      if (!opponentStatsMap.has(opponent)) {
        opponentStatsMap.set(opponent, {
          wins: 0,
          losses: 0,
          displayName: record.idBattlenet1Original,
        });
      }
      const oppStat = opponentStatsMap.get(opponent)!;
      if (winner === 2) oppStat.wins++;
      else if (winner === 1) oppStat.losses++;
    }
  });

  const opponentStats: OpponentStats[] = [];
  opponentStatsMap.forEach((stat, opponentId) => {
    const total = stat.wins + stat.losses;
    opponentStats.push({
      opponentId,
      opponentDisplayName: stat.displayName,
      wins: stat.wins,
      losses: stat.losses,
      total,
      winRate: total > 0 ? (stat.wins / total) * 100 : 0,
    });
  });

  return opponentStats.sort((a, b) => b.total - a.total);
};

// 대회별 통계 계산
const calculateCompStats = (
  playerId: string,
  records: MatchRecord[]
): CompStats[] => {
  const compStatsMap = new Map<string, { wins: number; losses: number }>();

  records.forEach((record) => {
    const winner = getWinner(record);
    if (!record.nameComp) return;

    if (record.idBattlenet1 === playerId) {
      if (!compStatsMap.has(record.nameComp)) {
        compStatsMap.set(record.nameComp, { wins: 0, losses: 0 });
      }
      const compStat = compStatsMap.get(record.nameComp)!;
      if (winner === 1) compStat.wins++;
      else if (winner === 2) compStat.losses++;
    }

    if (record.idBattlenet2 === playerId) {
      if (!compStatsMap.has(record.nameComp)) {
        compStatsMap.set(record.nameComp, { wins: 0, losses: 0 });
      }
      const compStat = compStatsMap.get(record.nameComp)!;
      if (winner === 2) compStat.wins++;
      else if (winner === 1) compStat.losses++;
    }
  });
  const compStats: CompStats[] = [];
  compStatsMap.forEach((stat, compName) => {
    const total = stat.wins + stat.losses;
    compStats.push({
      compName,
      wins: stat.wins,
      losses: stat.losses,
      total,
      winRate: total > 0 ? (stat.wins / total) * 100 : 0,
    });
  });

  return compStats.sort((a, b) => b.total - a.total);
};

// 카테고리별 통계 계산 (REMARK2 필드 기준)
const calculateCategoryStats = (
  playerId: string,
  records: MatchRecord[],
  categoryValue: string
): CategoryStats => {
  let wins = 0;
  let losses = 0;

  records.forEach((record) => {
    const winner = getWinner(record);
    // REMARK2 필드가 categoryValue와 일치하는지 확인
    if (!record.remark2 || record.remark2 !== categoryValue) return;

    if (record.idBattlenet1 === playerId) {
      if (winner === 1) wins++;
      else if (winner === 2) losses++;
    }

    if (record.idBattlenet2 === playerId) {
      if (winner === 2) wins++;
      else if (winner === 1) losses++;
    }
  });

  const total = wins + losses;
  return {
    wins,
    losses,
    total,
    winRate: total > 0 ? (wins / total) * 100 : 0,
  };
};

// 종족전 통계 계산
const calculateRaceMatchupStats = (
  playerId: string,
  records: MatchRecord[]
): RaceMatchupStats[] => {
  const raceMatchupMap = new Map<string, { wins: number; losses: number }>();

  records.forEach((record) => {
    const winner = getWinner(record);

    // 선수1인 경우
    if (record.idBattlenet1 === playerId && record.race2) {
      const vsRace = record.race2;
      if (!raceMatchupMap.has(vsRace)) {
        raceMatchupMap.set(vsRace, { wins: 0, losses: 0 });
      }
      const matchupStat = raceMatchupMap.get(vsRace)!;
      if (winner === 1) matchupStat.wins++;
      else if (winner === 2) matchupStat.losses++;
    }

    // 선수2인 경우
    if (record.idBattlenet2 === playerId && record.race1) {
      const vsRace = record.race1;
      if (!raceMatchupMap.has(vsRace)) {
        raceMatchupMap.set(vsRace, { wins: 0, losses: 0 });
      }
      const matchupStat = raceMatchupMap.get(vsRace)!;
      if (winner === 2) matchupStat.wins++;
      else if (winner === 1) matchupStat.losses++;
    }
  });

  const raceMatchupStats: RaceMatchupStats[] = [];
  raceMatchupMap.forEach((stat, vsRace) => {
    const total = stat.wins + stat.losses;
    raceMatchupStats.push({
      vsRace,
      wins: stat.wins,
      losses: stat.losses,
      total,
      winRate: total > 0 ? (stat.wins / total) * 100 : 0,
    });
  });

  // T, P, Z 순서로 정렬
  const raceOrder = ["T", "P", "Z"];
  return raceMatchupStats.sort((a, b) => {
    return raceOrder.indexOf(a.vsRace) - raceOrder.indexOf(b.vsRace);
  });
};

// 선수 목록 생성
export const getPlayerSummaries = (
  statsMap: Map<string, PlayerStats>
): PlayerSummary[] => {
  const summaries: PlayerSummary[] = [];

  statsMap.forEach((stats) => {
    // 주 종족 찾기
    let mainRace = "";
    let maxCount = 0;
    Object.entries(stats.raceUsage).forEach(([race, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mainRace = race;
      }
    });

    // 티어 찾기 (가장 최근 경기에서)
    let tier = "";
    if (stats.recentMatches.length > 0) {
      const recentMatch = stats.recentMatches[0];
      tier =
        recentMatch.idBattlenet1 === stats.playerId
          ? recentMatch.tier1
          : recentMatch.tier2;
    }

    summaries.push({
      playerId: stats.playerId,
      displayName: stats.displayName,
      totalGames: stats.totalGames,
      wins: stats.wins,
      losses: stats.losses,
      winRate: stats.winRate,
      mainRace,
      tier,
    });
  });
  return summaries.sort((a, b) => b.totalGames - a.totalGames);
};

// 맵별 종족 매치업 통계 계산
export const calculateMapStatistics = (
  records: MatchRecord[]
): MapStatistics[] => {
  const mapStatsMap = new Map<
    string,
    Map<string, { wins: number; losses: number }>
  >();

  records.forEach((record) => {
    const winner = getWinner(record);
    if (!record.map || !record.race1 || !record.race2 || !winner) return;

    // 맵별로 매치업 통계 초기화
    if (!mapStatsMap.has(record.map)) {
      mapStatsMap.set(record.map, new Map());
    }
    const matchupMap = mapStatsMap.get(record.map)!;

    // 매치업 키 생성 (알파벳 순서로 정렬)
    const races = [record.race1, record.race2].sort();
    const matchupKey = `${races[0]}v${races[1]}`;

    if (!matchupMap.has(matchupKey)) {
      matchupMap.set(matchupKey, { wins: 0, losses: 0 });
    }

    const matchupStat = matchupMap.get(matchupKey)!;

    // 첫 번째 종족(알파벳순)이 이긴 경우
    if (
      (races[0] === record.race1 && winner === 1) ||
      (races[0] === record.race2 && winner === 2)
    ) {
      matchupStat.wins++;
    } else {
      matchupStat.losses++;
    }
  });

  // 결과 배열 생성
  const mapStatistics: MapStatistics[] = [];
  mapStatsMap.forEach((matchupMap, map) => {
    const matchups: MapMatchupStats[] = [];
    let totalGames = 0;

    matchupMap.forEach((stat, matchup) => {
      const total = stat.wins + stat.losses;
      totalGames += total;
      matchups.push({
        matchup,
        wins: stat.wins,
        losses: stat.losses,
        total,
        winRate: total > 0 ? (stat.wins / total) * 100 : 0,
      });
    });

    // 매치업 정렬 (PvT, PvZ, TvZ, PvP, TvT, ZvZ 순서)
    const matchupOrder = ["PvT", "PvZ", "TvZ", "PvP", "TvT", "ZvZ"];
    matchups.sort((a, b) => {
      return matchupOrder.indexOf(a.matchup) - matchupOrder.indexOf(b.matchup);
    });

    mapStatistics.push({
      map,
      totalGames,
      matchups,
    });
  });

  // 총 경기 수로 정렬
  return mapStatistics.sort((a, b) => b.totalGames - a.totalGames);
};
