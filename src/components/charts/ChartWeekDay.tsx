import dynamic from "next/dynamic";
import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { TypographySmall } from "@/components/typography/TypographySmall";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const ChartWeekDay = (props: HTMLAttributes<HTMLDivElement>) => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const { data, isLoading, isError } =
    api.patients.getTotalPatientsByWeekDay.useQuery(
      { from: dateRange.from!, to: dateRange.to! },
      {
        onError: (error) => {
          toast({
            title: "Houve ao gerar o gráfico de pacientes por dia da semana!",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );

  return (
    <Card {...props} className="p-2">
      <TypographySmall>Pacientes X Dia da Semana</TypographySmall>
      {isLoading || isError ? (
        <SkeletonChart />
      ) : (
        <Chart
          options={{
            chart: {
              type: "line",
              fontFamily: "Roboto",
              zoom: {
                enabled: false,
              },
              toolbar: {
                show: true,
                tools: {
                  download: true,
                },
                export: {
                  csv: {
                    filename: undefined,
                    columnDelimiter: ";",
                    headerCategory: "Dia",
                    headerValue: "Quantidade",
                  },
                },
                autoSelected: "zoom",
              },
            },
            colors: ["hsl(var(--primary))"],
            stroke: {
              curve: "smooth",
            },
          }}
          series={[
            {
              data: data.map((item) => ({
                x: item.weekDay,
                y: item.count,
              })),
            },
          ]}
          type="line"
        />
      )}
    </Card>
  );
};
