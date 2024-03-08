"use client";

import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
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
import { endOfDay, startOfDay, subDays } from "date-fns";

export const ChartGender = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data, isLoading } = api.pacientes.countByGender.useQuery({
    from: dateRange.from,
    to: dateRange.to,
  });

  if (isLoading) {
    return <SkeletonChart />;
  }

  return (
    <Card {...props} className="p-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Pacientes X Sexo
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} width={300} height={300} margin={{ top: 20 }}>
            <XAxis
              dataKey="sexo"
              type="category"
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <YAxis
              dataKey="count"
              type="number"
              axisLine={false}
              fontSize={12}
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
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data?.map((item) => (
                <Cell
                  className={cn(
                    item.sexo === "Masculino"
                      ? "fill-[#ce5d13]"
                      : item.sexo === "Feminino"
                        ? "fill-primary"
                        : "fill-muted-foreground",
                  )}
                />
              ))}
            </Bar>
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
