import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { type HtmlHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useRiskQuery } from "@/hooks/useRiskQuery";

const riskColors: Record<string, string> = {
  "VERMELHO(RISCO ALTO)": "hsl(var(--primary))",
  "AMARELO(RISCO MÉDIO)": "#FBB91C",
  "VERDE(BAIXO RISCO)": "#51D275",
  "AZUL(INDEFINIVEL)": "#1eb1e7",
};

export const RiskChart = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  const { data, isLoading, isError } = useRiskQuery();
  return (
    <Card
      className={cn("w-full p-2 sm:w-[400px] lg:flex-grow", className)}
      {...props}
    >
      <TypographyH4>Ocorrências x Risco</TypographyH4>

      {isLoading || isError ? (
        <SkeletonChart />
      ) : (
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
      )}
    </Card>
  );
};
