"use client";

import { type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { Hourglass, PhoneCall } from "lucide-react";

export const MonitoramentoEstatisticasGerais = ({
  initialData,
}: {
  initialData: RouterOutputs["ocorrencias"]["getDailyInfo"];
}) => {
  const { data } = api.ocorrencias.getDailyInfo.useQuery(undefined, {
    initialData,
    refetchInterval: 5000, //5s
  });

  return (
    <div className="col-span-full grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {data?.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
            <CardTitle className="text-base font-medium">
              {item.label}
            </CardTitle>
            {item.value.includes("min") ? (
              <Hourglass className="h-4 text-muted-foreground" />
            ) : (
              <PhoneCall className="h-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent className="px-2 pb-4 sm:px-6 ">
            <div className="text-lg font-bold text-primary sm:text-2xl">
              {item.value}
            </div>
            {/*    <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

type InfoCardProps = {
  title: string;
  children: ReactNode;
};

const InfoCard = ({ title, children }: InfoCardProps) => {
  return (
    <Card className="flex flex-col justify-center px-4 py-1">
      <TypographySmall>{title}</TypographySmall>
      <span className="font-bold text-primary">{children}</span>
    </Card>
  );
};
