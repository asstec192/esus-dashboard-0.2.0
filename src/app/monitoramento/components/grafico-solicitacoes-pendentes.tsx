"use client";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
/* 
const renderShape =
  (key, pixel = 10) =>
  ({ height, width, fill, x, y, ...rest }) => {
    const xpercent = Math.trunc((pixel * 100) / Math.trunc(height || 1));
    return (
      <svg x={x} y={y} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={key} x1="0%" y1="0%" x2="0%" y2={`${xpercent}%`}>
            <stop offset="50%" stopColor="white" />
            <stop offset="50%" stopColor={fill} stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect fill={`url(#${key})`} width={width} height={height} />
      </svg>
    );
  };
 */
export function ChartSolocitacoesPendentes({
  initialData,
}: {
  initialData: RouterOutputs["veiculos"]["situacaoSolicitacoes"];
}) {
  const { data } = api.veiculos.situacaoSolicitacoes.useQuery(undefined, {
    initialData,
    refetchInterval: 5000,
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart width={300} height={300} data={data}>
        <XAxis
          dataKey="veiculo"
          axisLine={false}
          tickLine={false}
          fontSize={12}
        />
        <YAxis axisLine={false} fontSize={12} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                    {label} pendentes
                  </span>

                  <span className="font-bold text-muted-foreground">
                    {payload[0]?.value}
                  </span>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="totalPendente"
          className="fill-primary"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
