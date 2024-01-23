"use client";

import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";
import Chart from "react-apexcharts";

export const ChartHour = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading, isError } =
    api.ocorrencias.countByHoraDeEnvioDoVeiculo.useQuery(
      { from: dateRange.from!, to: dateRange.to! },
      {
        onError: (error) => {
          toast({
            title:
              "Erro ao gerar o gráfico de ocorrências por horário de deslocamento!",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );

  return (
    <Card {...props} className="p-2">
      <TypographySmall>Ocorrências X Horário de Deslocamento</TypographySmall>
      {isLoading || isError ? (
        <SkeletonChart />
      ) : (
        <Chart
          options={{
            chart: {
              type: "bar",
              fontFamily: "Roboto",
              toolbar: {
                show: true,
                tools: {
                  download: true,
                },
                export: {
                  csv: {
                    filename: undefined,
                    columnDelimiter: ";",
                    headerCategory: "Intervalo",
                    headerValue: "Quantidade",
                  },
                },
                autoSelected: "zoom",
              },
            },
            colors: ["hsl(var(--primary))"],
            dataLabels: {
              enabled: false,
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
          }}
          series={[
            {
              data: data.map((item) => ({
                x: item.intervalo,
                y: item.contagem,
              })),
            },
          ]}
          type="bar"
        />
      )}
    </Card>
  );
};
