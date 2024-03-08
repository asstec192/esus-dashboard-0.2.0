"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const ChartLigacoes = () => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data } = api.ocorrencias.countByTipoLigacao.useQuery({
    ...dateRange,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Total de ocorrências por tipo de ligação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
            <Bar
              dataKey="count"
              className="fill-primary"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Dados referentes ao período de{" "}
          {startOfDay(dateRange.from).toLocaleString()} a{" "}
          {endOfDay(subDays(dateRange.to, 1)).toLocaleString()}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};
