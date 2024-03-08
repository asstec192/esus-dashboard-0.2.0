"use client";

import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
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
import { HTMLAttributes } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ChartTipoOcorrencia(props: HTMLAttributes<HTMLDivElement>) {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data, isLoading } = api.ocorrencias.countByTipo.useQuery({
    ...dateRange,
  });

  if (isLoading) {
    return <SkeletonChart />;
  }

  return (
    <Card {...props} className="p-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Ocorrências X Tipo
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            barCategoryGap={2}
            layout="vertical"
            margin={{ top: 20 }}
          >
            <XAxis
              dataKey="count"
              type="number"
              fontSize={12}
              axisLine={false}
            />
            <YAxis
              width={100}
              dataKey="tipo"
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
}
