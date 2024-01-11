"use client";

import Chart from "react-apexcharts";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

const riskColors: Record<string, string> = {
  "VERMELHO(RISCO ALTO)": "hsl(var(--primary))",
  "AMARELO(RISCO MÉDIO)": "#FBB91C",
  "VERDE(BAIXO RISCO)": "#51D275",
  "AZUL(INDEFINIVEL)": "#1eb1e7",
};

export const ChartRisk = ({
  initialData,
}: {
  initialData: RouterOutputs["incidents"]["getTotalIncidentsByRisk"];
}) => {
  const { data } = api.incidents.getTotalIncidentsByRisk.useQuery(undefined, {
    initialData,
    refetchInterval: 5000, //5s
  });

  return (
    <Chart
      options={{
        chart: {
          type: "donut",
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
                headerCategory: "Risco",
                headerValue: "Quantidade",
              },
            },
            autoSelected: "zoom",
          },
        },
        labels: data.map((item) => item.risco),
        colors: data.map((item) => riskColors[item.risco]),
        dataLabels: {
          enabled: true,
          dropShadow: {
            enabled: false,
          },
        },
        legend: { show: false },
        plotOptions: {
          pie: {
            expandOnClick: false,
          },
        },
        stroke: { show: false },
      }}
      series={data.map((item) => item.total)}
      type="pie"
      width="100%"
    />
  );
};
