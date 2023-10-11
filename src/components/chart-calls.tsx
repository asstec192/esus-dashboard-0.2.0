import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { useCallsQuery } from "../hooks/useCallsQuery";
import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { type HtmlHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const CallsChart = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  const { data, isError, isLoading } = useCallsQuery();
  return (
    <Card
      className={cn("w-full p-2 sm:w-[400px] lg:flex-grow", className)}
      {...props}
    >
      <TypographyH4>Ligações</TypographyH4>

      {isLoading || isError ? (
        <SkeletonChart className="w-full" />
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
        />
      )}
    </Card>
  );
};
