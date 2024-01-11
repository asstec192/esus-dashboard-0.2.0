"use client";

import { api } from "@/trpc/react";
import Chart from "react-apexcharts";
import { RouterOutputs } from "@/trpc/shared";

export const ChartCalls = ({
  initialData,
}: {
  initialData: RouterOutputs["incidents"]["getTotalIncidentsByCallType"];
}) => {
  const { data } = api.incidents.getTotalIncidentsByCallType.useQuery(
    undefined,
    {
      initialData,
      refetchInterval: 5000, //5s
    },
  );

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
