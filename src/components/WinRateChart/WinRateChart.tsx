import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styled from "styled-components";

interface WinRateChartProps {
  wins: number;
  losses: number;
  size?: number;
}

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const CenterText = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const WinRate = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Record = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const WinRateChart: React.FC<WinRateChartProps> = ({
  wins,
  losses,
  size = 120,
}) => {
  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  const data = [
    { name: "승", value: wins },
    { name: "패", value: losses },
  ];

  // 승리: 그라디언트, 패배: 어두운 보라-회색 (그라디언트와 조화)
  const COLORS = ["#57EFD6", "#5B4E7C"];

  if (total === 0) {
    return (
      <ChartContainer style={{ height: size }}>
        <CenterText>
          <WinRate>-</WinRate>
          <Record>0승 0패</Record>
        </CenterText>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer style={{ height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="winGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3FE6FD" />
              <stop offset="100%" stopColor="#C623FF" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.42}
            paddingAngle={3}
            dataKey="value"
            style={{ outline: "none" }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? "url(#winGradient)" : COLORS[index]}
                style={{ outline: "none" }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <CenterText>
        <WinRate>{winRate.toFixed(1)}%</WinRate>
        <Record>
          {wins}승 {losses}패
        </Record>
      </CenterText>
    </ChartContainer>
  );
};
