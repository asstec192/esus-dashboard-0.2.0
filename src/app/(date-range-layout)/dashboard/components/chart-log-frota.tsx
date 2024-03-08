"use client";

import { SkeletonChart } from "@/components/skeletons/skeleton-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { getFloatHourFromDate } from "@/utils/getFloatHourFromDate";
import { addHours, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { floatToHourString } from "./chart-log-solicitacoes";

const initialLineProps = [
  { key: "percentualUSB", color: "#4ade80", hide: false },
  { key: "percentualUSA", color: "#dc2626", hide: false },
  { key: "percentualUSI", color: "#ff7300", hide: false },
  { key: "percentualMOT", color: "#3b82f6", hide: false },
  { key: "percentualBIK", color: "#8884d8", hide: false },
  { key: "percentualREM", color: "#ffc658", hide: false },
];

export function ChartLogFrota() {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const date = startOfDay(dateRange.from);
  const [hourRange, setHourRange] = useState([0, 24]);
  const [lineProps, setLineProps] = useState(initialLineProps);

  const toggleLine = (index: number) => {
    setLineProps((prevLineProps) => {
      const updatedLineProps = [...prevLineProps];
      updatedLineProps[index] = {
        ...updatedLineProps[index],
        hide: !updatedLineProps[index]?.hide,
      } as (typeof initialLineProps)[0];
      return updatedLineProps;
    });
  };

  const { data } = api.veiculos.logSituacaoDaFrota.useQuery(
    { date },
    // { refetchInterval: 5000 },
  );

  const chartData = useMemo(
    () =>
      data?.filter((item) => {
        const itemHour = getFloatHourFromDate(addHours(item.createdAt, 3));
        return itemHour > hourRange[0]! && itemHour < hourRange[1]!;
      }),
    [data, hourRange],
  );

  if (!data) {
    return <SkeletonChart />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Histórico de ocupação da frota
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          onValueChange={setHourRange}
          value={hourRange}
          min={0}
          max={24}
          step={1}
          formatLabel={(label) => `${label}h`}
        />
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={500} height={300} data={chartData}>
            <XAxis
              dataKey={(value) =>
                getFloatHourFromDate(addHours(value.createdAt, 3))
              }
              fontSize={12}
              tickFormatter={floatToHourString}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              interval={0}
              tickFormatter={(value) => `${value}%`}
              ticks={Array.from({ length: 11 }, (_, index) => index * 10)}
              fontSize={12}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                      {payload.map((item, i) => {
                        console.log(item);
                        const veiculo = item.dataKey?.toString().slice(-3);
                        const percentual = item.value;
                        const ocupados =
                          item.payload[`${veiculo}_ocupadas`] ?? 0;
                        const disponiveis =
                          item.payload[`${veiculo}_total`] ?? 0;
                        return (
                          <>
                            {i === 0 ? (
                              <span
                                key={`hora${i}`}
                                className="text-[0.70rem] uppercase"
                              >
                                Horário:{" "}
                                {floatToHourString(
                                  getFloatHourFromDate(
                                    addHours(payload[0]?.payload.createdAt, 3),
                                  ),
                                )}
                              </span>
                            ) : null}
                            <span
                              key={`valor${i}`}
                              style={{ color: item.color }}
                              className="text-[0.70rem] uppercase"
                            >
                              {veiculo} : {ocupados} de {disponiveis} (
                              {percentual}%)
                            </span>
                          </>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              className="cursor-pointer"
              content={({ payload }) => (
                <div className="flex items-center justify-center">
                  {payload?.map((item, index) => (
                    <Button
                      variant="ghost"
                      className={cn(
                        "font-semibold",
                        lineProps[index]?.hide && "line-through",
                      )}
                      onClick={() => toggleLine(index)}
                      style={{ color: item.color }}
                    >
                      {item.value.slice(-3)}
                    </Button>
                  ))}
                </div>
              )}
            />
            {lineProps.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                dot={false}
                hide={line.hide}
                fillOpacity={line.hide ? 1 : 0}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Dados referentes ao dia {date.toLocaleString().slice(0, 10)}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
