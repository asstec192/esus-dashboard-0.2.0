import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import { useRegulacaoSecundariaStore } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { RouterOutputs } from "@/trpc/shared";
import { useState } from "react";

export function useIntercorrencias() {
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  //Busca as intercorrencias
  const { data: intercorrencias } = api.intercorrencia.countIncidents.useQuery({
    dateRange,
    turn,
  });

  const [intercorrenciaSelecionada, setIntercorrenciaSelecionada] =
    useState<RouterOutputs["intercorrencia"]["countIncidents"][0]>();

  //busca as ocorrencias e uma intercorrencia especifica
  const ocorrenciasQuery = api.intercorrencia.getIncidents.useQuery(
    { dateRange, turn, intercorrenciaId: intercorrenciaSelecionada?.id || 0 },
    {
      enabled: !!intercorrenciaSelecionada,
      onSuccess: setOcorrencias,
      onError: (error) => {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  return {
    intercorrencias,
    ocorrenciasQuery,
    intercorrenciaSelecionada,
    setIntercorrenciaSelecionada,
  };
}
