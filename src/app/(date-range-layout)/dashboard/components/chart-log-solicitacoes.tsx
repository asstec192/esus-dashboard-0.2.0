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

const initialLineProps = [
  { key: "USB_percentual", color: "#4ade80", hide: false },
  { key: "USA_percentual", color: "#dc2626", hide: false },
  { key: "USI_percentual", color: "#ff7300", hide: false },
  { key: "MOT_percentual", color: "#3b82f6", hide: false },
  { key: "BIK_percentual", color: "#8884d8", hide: false },
  { key: "REM_percentual", color: "#ffc658", hide: false },
];

export function ChartLogSolicitacoes() {
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

  const { data } = api.veiculos.logSolicitacoesPendentes.useQuery(
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
          Histórico de solicitações pendentes
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
              tickCount={10}
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="flex flex-col rounded-lg border bg-background p-2 shadow-sm">
                      {payload.map((item, i) => {
                        const veiculo = item.dataKey?.toString().slice(0, 3);
                        const percentual = item.value;
                        const pendentes =
                          item.payload[`${veiculo}_pendentes`] ?? 0;
                        const disponiveis =
                          item.payload[`${veiculo}_disponiveis`] ?? 0;
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
                              {veiculo}: {pendentes} de {disponiveis} (
                              {percentual}
                              %)
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
                      {item.value.slice(0, 3)}
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

export function floatToHourString(value: number) {
  const hour = Math.floor(value);
  const minutes = Math.round((value - hour) * 60);
  const paddedMinutes = minutes.toString().padStart(2, "0"); // Adiciona um zero à esquerda se necessário
  return minutes === 0 ? `${hour}` : `${hour}:${paddedMinutes}`;
}
