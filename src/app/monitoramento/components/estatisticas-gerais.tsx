"use client";

import { type ReactNode } from "react";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { Card } from "@/components/ui/card";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

export const MonitoramentoEstatisticasGerais = ({
  initialData,
}: {
  initialData: RouterOutputs["incidents"]["getDailyInfo"];
}) => {
  const { data } = api.incidents.getDailyInfo.useQuery(undefined, {
    initialData,
    refetchInterval: 5000, //5s
  });

  return (
    <>
      <InfoCard title="Ligações">{data.totalLigacoes}</InfoCard>
      <InfoCard title="Tempo Geral">{data.tempoGeral || 0} min</InfoCard>
      <InfoCard title="QTY-QUS">{data.QTYQUS || 0} min</InfoCard>
      <InfoCard title="QUS-QUY">{data.QUSQUY || 0} min</InfoCard>
      <InfoCard title="QUY-QUU">{data.QUYQUU || 0} min</InfoCard>
    </>
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
      <TypographyH4 className="font-bold text-primary">{children}</TypographyH4>
    </Card>
  );
};