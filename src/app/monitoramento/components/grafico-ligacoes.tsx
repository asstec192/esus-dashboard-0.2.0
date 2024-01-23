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

export const ChartCalls = ({
  initialData,
}: {
  initialData: RouterOutputs["ocorrencias"]["countByTipoLigacao"];
}) => {
  const { data } = api.ocorrencias.countByTipoLigacao.useQuery(undefined, {
    initialData,
    refetchInterval: 5000, //5s
  });

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} barCategoryGap={2} layout="vertical">
        <XAxis
          dataKey="count"
          type="number"
          stroke="#888888"
          fontSize={12}
          axisLine={false}
        />
        <YAxis
          width={130}
          dataKey="label"
          type="category"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => value.toLowerCase()}
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
