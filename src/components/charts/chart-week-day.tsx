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

export const ChartWeekDay = ({
  data,
  loading,
}: {
  data: RouterOutputs["pacientes"]["countByWeekDay"];
  loading?: boolean;
}) => {
  if (loading) return <SkeletonChart />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20 }}>
        <XAxis
          dataKey="weekDay"
          type="category"
          axisLine={false}
          tickLine={false}
          fontSize={12}
        />
        <YAxis dataKey="count" type="number" axisLine={false} fontSize={12} />
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
        <Bar dataKey="count" className="fill-primary" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
