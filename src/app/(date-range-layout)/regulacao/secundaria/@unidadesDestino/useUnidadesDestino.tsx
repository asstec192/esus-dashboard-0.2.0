import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import { useRegulacaoSecundariaStore } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { RouterOutputs } from "@/trpc/shared";

export function useUnidadesDestino() {
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  //busca relatorio das unidades de destino
  const { data: unidades } = api.destinations.getResponseTimes.useQuery({
    dateRange,
    turn,
  });

  const [unidadeSelecionada, setUnidadeSelecionada] =
    useState<RouterOutputs["destinations"]["getResponseTimes"][0]>();

  //busca as ocorrencias de uma unidade de destino especifica
  const ocorrenciasQuery = api.destinations.getIncidents.useQuery(
    { dateRange, turn, destinationId: Number(unidadeSelecionada?.id) },
    {
      enabled: !!unidadeSelecionada,
      onSuccess: setOcorrencias,
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  return {
    unidades,
    ocorrenciasQuery,
    unidadeSelecionada,
    setUnidadeSelecionada,
  };
}
