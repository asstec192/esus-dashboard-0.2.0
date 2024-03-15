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

export function ChartMotivoOcorrencia({
  data,
  loading,
  tipoId,
}: {
  data: RouterOutputs["ocorrencias"]["countByMotivo"];
  loading?: boolean;
  tipoId: number;
}) {
  if (loading) return <SkeletonChart />;

  return (
    <div className="flex flex-col">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data.filter((item) => item.tipoId === tipoId)}
          barCategoryGap={2}
          layout="vertical"
          margin={{ top: 20 }}
        >
          <XAxis dataKey="count" type="number" fontSize={12} axisLine={false} />
          <YAxis
            width={220}
            dataKey="motivo"
            type="category"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={0}
            // tickFormatter={(value) => (value as string).toLowerCase()}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && !!payload?.length) {
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
          <Bar dataKey="count" className="fill-primary" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}