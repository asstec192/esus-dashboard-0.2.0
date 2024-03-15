"use client";

import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RouterOutputs } from "@/trpc/shared";

export const ChartAge = ({
  data,
  loading,
}: {
  data: RouterOutputs["pacientes"]["countByAgeRange"];
  loading?: boolean;
}) => {
  if (loading) return <SkeletonChart />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        barCategoryGap={2}
        layout="vertical"
        margin={{ top: 20 }}
      >
        <XAxis dataKey="count" type="number" fontSize={12} axisLine={false} />
        <YAxis
          width={100}
          dataKey="faixa"
          type="category"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ position: "center" }}
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
        <Bar dataKey="count" className="fill-primary" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
