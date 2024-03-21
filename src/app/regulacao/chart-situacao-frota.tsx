"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RouterOutputs } from "@/trpc/shared";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";

export function ChartSituacaoFrota({
  data,
  loading,
}: {
  data: RouterOutputs["veiculos"]["situacaoDaFrota"];
  loading?: boolean;
}) {
  if (loading) {
    return <SkeletonChart />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} stackOffset="expand">
        <XAxis
          dataKey="veiculo"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          axisLine={false}
          interval={0}
          domain={[0, 1]}
          tickCount={10}
          ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
          tickFormatter={(value) => `${value * 100}%`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const totalOcupado = payload[0]?.value as number;
              const totalLivre = payload[1]?.value as number;
              const total = totalOcupado + totalLivre;
              return (
                <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                    {label} ocupadas
                  </span>

                  <span className="font-bold text-muted-foreground">
                    {totalOcupado} de {total}
                  </span>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="totalOcupado"
          stackId="a"
          className="fill-primary"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="totalLivre"
          stackId="a"
          className="fill-secondary"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
