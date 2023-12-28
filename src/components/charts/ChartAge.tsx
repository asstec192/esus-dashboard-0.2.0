"use client";

import { HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";
import Chart from "react-apexcharts";

export const ChartAge = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading, isError } = api.patients.getPatientsByAge.useQuery(
    { from: dateRange.from!, to: dateRange.to! },
    {
      onError: (error) => {
        toast({
          title: "Houve ao gerar o gráfico de pacientes por idade!",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  return (
    <Card {...props} className="p-2">
      <TypographySmall>Pacientes X Faixa Etária</TypographySmall>
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
                    headerCategory: "Faixa Etária",
                    headerValue: "Quantidade",
                  },
                },
                autoSelected: "zoom",
              },
            },
            colors: ["hsl(var(--primary))"],
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            dataLabels: {
              enabled: false,
            },
          }}
          series={[
            {
              data: data.map((item) => ({
                x: item.ageRange,
                y: item.count,
              })),
            },
          ]}
          type="bar"
        />
      )}
    </Card>
  );
};
