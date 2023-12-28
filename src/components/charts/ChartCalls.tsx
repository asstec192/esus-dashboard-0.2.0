"use client";

import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { toast } from "../ui/use-toast";
import { api } from "@/trpc/react";
import Chart from "react-apexcharts";

export const ChartCalls = () => {
  const { data, isLoading, isError } =
    api.incidents.getTotalIncidentsByCallType.useQuery(undefined, {
      refetchInterval: 5000, //5s
      onError: () => {
        toast({
          variant: "destructive",
          description: "Houve um erro ao gerar o gráfico de ligações!",
        });
      },
    });

  if (isLoading || isError) return <SkeletonChart />;

  return (
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
                headerCategory: "Tipo",
                headerValue: "Quantidade",
              },
            },
            autoSelected: "zoom",
          },
        },
        colors: ["hsl(var(--primary))"],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: data.map((ligacao) => ligacao.tipo),
        },
      }}
      series={[
        {
          data: data.map((ligacao) => ligacao.total),
        },
      ]}
      type="bar"
      width="100%"
      height="100%"
    />
  );
};
