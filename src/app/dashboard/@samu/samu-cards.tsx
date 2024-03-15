"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import type { RouterOutputs } from "@/trpc/shared";
import { Hourglass } from "lucide-react";

export const SAMUCards = ({
  movimentacoes: initialMovimentacoes,
}: {
  movimentacoes: RouterOutputs["tempoResposta"]["movimentacoes"];
}) => {
  const { data: movimentacoes } = api.tempoResposta.movimentacoes.useQuery(
    undefined,
    { initialData: initialMovimentacoes, refetchInterval: 5000 },
  );

  return (
    <div className="col-span-full grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {movimentacoes?.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 pb-2 sm:px-6">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            <Hourglass className="h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-2 pb-4 sm:px-6 ">
            <div className="text-lg font-bold text-primary sm:text-2xl">
              {item.value} min
            </div>
            {/*    <p className="text-xs text-muted-foreground">
              +20.1% fora do esperado
            </p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
