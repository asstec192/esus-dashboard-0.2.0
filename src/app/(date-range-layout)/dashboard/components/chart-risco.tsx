"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { endOfDay, startOfDay, subDays } from "date-fns";

export const ChartRisco = () => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data: riscos } = api.ocorrencias.countByRisco.useQuery({
    ...dateRange,
  });

  if (!riscos) return <SkeletonChart />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Total de ocorrências por classificação de risco
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="count"
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
