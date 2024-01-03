"use client"

import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";
import Chart from "react-apexcharts";

export const ChartVehicles = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading, isError } =
    api.incidents.getTotalIncidentsByVehicleType.useQuery(
      { from: dateRange.from!, to: dateRange.to! },
      {
        onError: (error) => {
          toast({
            title:
              "Houve ao gerar o gráfico de ocorrências por tipo de veículo!",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );

  //Gambiarra para somar as contagens dos tipos "M-0," "M-1," e "USB" e juntá-los em um único tipo, "USB"
  const modifiedData = data?.reduce(
    (accumulator, currentItem) => {
      const type =
        currentItem.tipo === "M-0" ||
        currentItem.tipo === "M-1" ||
        currentItem.tipo === "USB"
          ? "USB"
          : currentItem.tipo;
      const existingEntry = accumulator.find((entry) => entry.x === type);

      if (existingEntry) {
        existingEntry.y += currentItem.contagem;
      } else {
        accumulator.push({ x: type, y: currentItem.contagem });
      }
      return accumulator;
    },
    [] as { x: string; y: number }[],
  );

  return (
    <Card {...props} className="p-2">
      <TypographySmall>Ocorrências X Tipo de Veìculo</TypographySmall>
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
                    headerCategory: "Tipo de Veículo",
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
          }}
          series={[
            //@ts-ignore
            {
              data: modifiedData,
            },
          ]}
          type="bar"
        />
      )}
    </Card>
  );
};
