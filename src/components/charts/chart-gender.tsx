"use client";

import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/shared";

export const ChartGender = ({
  data,
  loading,
}: {
  data: RouterOutputs["pacientes"]["countByGender"];
  loading?: boolean;
}) => {
  if (loading) return <SkeletonChart />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} width={300} height={300} margin={{ top: 20 }}>
        <XAxis
          dataKey="sexo"
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
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data?.map((item) => (
            <Cell
              className={cn(
                item.sexo.toLowerCase() === "masculino"
                  ? "fill-[#ce5d13]"
                  : item.sexo.toLowerCase() === "feminino"
                    ? "fill-primary"
                    : "fill-muted-foreground",
              )}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
