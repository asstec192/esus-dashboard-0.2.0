"use client";

import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import type { RouterOutputs } from "@/trpc/shared";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ChartTipoOcorrencia({
  data,
  loading,
  onBarHover,
}: {
  data: RouterOutputs["ocorrencias"]["countByTipo"];
  loading?: boolean;
  onBarHover?: (tipoId: number) => void;
}) {
  if (loading) return <SkeletonChart />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={2} layout="vertical">
        <XAxis dataKey="count" type="number" fontSize={12} axisLine={false} />
        <YAxis
          width={130}
          dataKey="tipo"
          type="category"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                    {label}
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
          onMouseEnter={(data) => onBarHover?.(data.tipoId as number)}
          dataKey="count"
          className="fill-primary"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Função para abreviar legendas
function abreviarLegenda(legenda: string, comprimentoMaximo: number) {
  if (legenda.length > comprimentoMaximo) {
    return legenda.substring(0, comprimentoMaximo) + "..."; // Adiciona "..." se a legenda for truncada
  } else {
    return legenda;
  }
}
