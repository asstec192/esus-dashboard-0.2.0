"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { RouterOutputs } from "@/trpc/shared";

export const ChartRisco = ({
  data,
  loading,
}: {
  data: RouterOutputs["ocorrencias"]["countByRisco"];
  loading?: boolean;
}) => {
  if (loading) return <SkeletonChart />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie dataKey="count" data={data} innerRadius="30%" outerRadius="100%">
          {data.map((risco) => (
            <Cell key={risco.label} className={cn(risco.colorClass.fill)} />
          ))}
        </Pie>

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                    {payload[0]?.payload.label}
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
      </PieChart>
    </ResponsiveContainer>
  );
};
