import dynamic from "next/dynamic";
import { type HTMLAttributes } from "react";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Card } from "@/components/ui/card";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { TypographySmall } from "@/components/typography/TypographySmall";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const VehicleTypeChart = (props: HTMLAttributes<HTMLDivElement>) => {
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
            {
              data: data.map((item) => ({
                x: item.tipo,
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
