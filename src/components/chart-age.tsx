import dynamic from "next/dynamic";
import { HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { api } from "@/utils/api";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { TypographySmall } from "@/components/typography/TypographySmall";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const AgeChart = (props: HTMLAttributes<HTMLDivElement>) => {
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
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  console.log(event);
                  console.log(chartContext);
                  console.log(config);
                },
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

