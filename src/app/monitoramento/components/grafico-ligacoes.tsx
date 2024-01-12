"use client";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const ChartCalls = ({
  initialData,
}: {
  initialData: RouterOutputs["incidents"]["getTotalIncidentsByCallType"];
}) => {
  const { data } = api.incidents.getTotalIncidentsByCallType.useQuery(
    undefined,
    {
      initialData,
      refetchInterval: 5000, //5s
    },
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={2} layout="vertical">
        <XAxis
          dataKey="total"
          type="number"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          width={130}
          dataKey="tipo"
          type="category"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => value.toLowerCase()}
          label={{ position: "center" }}
          interval={0}
        />
        <Bar dataKey="total" className="fill-primary" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
