"use client";

import Chart from "react-apexcharts";
import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";

export const ChartGender = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading, isError } = api.pacientes.countByGender.useQuery(
    { from: dateRange.from!, to: dateRange.to! },
    {
      onError: () => {
        toast({
          title: "Erro",
          description:
            "Houve um erro ao gerar o gráfico de pacientes por sexo!",
          variant: "destructive",
        });
      },
    },
  );

  return (
    <Card {...props} className="p-2">
      <TypographySmall>Pacientes X Sexo</TypographySmall>
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
                    headerCategory: "Sexo",
                    headerValue: "Quantidade",
                  },
                },
                autoSelected: "zoom",
              },
            },
            colors: ["rgba(16, 148, 158)"],
            dataLabels: {
              enabled: true,
            },
          }}
          series={[
            {
              data: data.map((item) => ({
                x: item.sexo,
                y: item.count,
                fillColor: genderColors[item.sexo],
              })),
            },
          ]}
          type="bar"
        />
      )}
    </Card>
  );
};

const genderColors: Record<string, string> = {
  "Não informado": "#979aa5",
  Masculino: "hsl(var(--secondary))",
  Feminino: "hsl(var(--primary))",
};
