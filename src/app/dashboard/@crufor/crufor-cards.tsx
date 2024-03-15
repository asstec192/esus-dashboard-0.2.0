"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { Hourglass, PhoneCall } from "lucide-react";

type CruforCardsProps = {
  ligacoesCount: RouterOutputs["ligacoes"]["liveCount"];
  medicos: RouterOutputs["tempoResposta"]["medico"];
  tarms: RouterOutputs["tempoResposta"]["tarm"];
};

export const CruforCards = ({
  ligacoesCount: initialLigacoesCount,
  medicos: initialMedicos,
  tarms: initialTarms,
}: CruforCardsProps) => {
  const { data: tarms } = api.tempoResposta.tarm.useQuery(undefined, {
    initialData: initialTarms,
    refetchInterval: 5000,
  });
  const { data: medicos } = api.tempoResposta.medico.useQuery(undefined, {
    initialData: initialMedicos,
    refetchInterval: 5000,
  });
  const { data: countLigacoes } = api.ligacoes.liveCount.useQuery(undefined, {
    initialData: initialLigacoesCount,
    refetchInterval: 5000,
  });

  const tempoTarms =
    tarms.reduce((acc, tarm) => (acc += tarm.tempo), 0) / tarms.length;

  const tempoMedicos =
    medicos.reduce((acc, medico) => (acc += medico.tempo), 0) / medicos?.length;

  return (
    <div className="col-span-full grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
          <CardTitle className="text-sm font-medium">Ligações</CardTitle>
          <PhoneCall className="h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6 ">
          <div className="text-lg font-bold text-primary sm:text-2xl">
            {countLigacoes}
          </div>
          {/*    <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
          <CardTitle className="text-sm font-medium">Tempo TARM</CardTitle>
          <Hourglass className="h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6 ">
          <div className="text-lg font-bold text-primary sm:text-2xl">
            {isNaN(tempoTarms) ? "" : Math.ceil(tempoTarms)} min
          </div>
          {/*    <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
          <CardTitle className="text-sm font-medium">Tempo Médico</CardTitle>
          <Hourglass className="h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-6 ">
          <div className="text-lg font-bold text-primary sm:text-2xl">
            {isNaN(tempoMedicos) ? "" : Math.ceil(tempoMedicos)} min
          </div>
          {/*    <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
        </CardContent>
      </Card>
    </div>
  );
};
