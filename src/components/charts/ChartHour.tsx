"use client";

import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const ChartHour = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading, isError } =
    api.ocorrencias.countByHoraDeEnvioDoVeiculo.useQuery({
      from: dateRange.from!,
      to: dateRange.to!,
    });

  return (
    <Card {...props} className="p-2">
      <TypographySmall>Ocorrências X Horário de Deslocamento</TypographySmall>
      {isLoading || isError ? (
        <SkeletonChart />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            barCategoryGap={2}
            layout="vertical"
            margin={{ top: 20 }}
          >
            <XAxis
              dataKey="contagem"
              type="number"
              fontSize={12}
              axisLine={false}
            />
            <YAxis
              width={100}
              dataKey="intervalo"
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
              dataKey="contagem"
              className="fill-primary"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
