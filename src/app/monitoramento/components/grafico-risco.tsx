"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { cn } from "@/lib/utils";

export const ChartRisk = ({
  initialData,
}: {
  initialData: RouterOutputs["ocorrencias"]["countByRisco"];
}) => {
  const { data: riscos } = api.ocorrencias.countByRisco.useQuery(undefined, {
    initialData,
    refetchInterval: 5000, //5s
  });

  return (
    <ResponsiveContainer width="100%" height={300} className="mb-[-150px]">
      <PieChart>
        <Pie
          dataKey="count"
          startAngle={180}
          endAngle={0}
          data={riscos}
          innerRadius="30%"
          outerRadius="100%"
        >
          {riscos.map((risco) => (
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
