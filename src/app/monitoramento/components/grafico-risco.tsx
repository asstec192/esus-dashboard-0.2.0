"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

const riskColors: Record<string, string> = {
  "VERMELHO(RISCO ALTO)": "hsl(var(--primary))",
  "AMARELO(RISCO MÉDIO)": "#FBB91C",
  "VERDE(BAIXO RISCO)": "#51D275",
  "AZUL(INDEFINIVEL)": "#1eb1e7",
};

export const ChartRisk = ({
  initialData,
}: {
  initialData: RouterOutputs["incidents"]["getTotalIncidentsByRisk"];
}) => {
  const { data } = api.incidents.getTotalIncidentsByRisk.useQuery(undefined, {
    initialData,
    refetchInterval: 5000, //5s
  });

  return (
    <ResponsiveContainer
      width="100%"
      height={300}
      className="mb-[-150px] overflow-hidden"
    >
      <PieChart>
        <Pie
          dataKey="total"
          startAngle={180}
          endAngle={0}
          data={data}
          innerRadius="30%"
          outerRadius="100%"
        >
          {data.map((item) => (
            <Cell key={item.risco} fill={riskColors[item.risco]} />
          ))}
        </Pie>

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                    {payload[0]?.payload.risco}
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
