import { useRegulacaoSecundariaStore } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { useState } from "react";
import { RouterOutputs } from "@/trpc/shared";

export function useUnidadesDestino() {
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
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
    {
      dateRange,
      destinationId: Number(unidadeSelecionada?.id),
      turn,
    },
    {
      enabled: !!unidadeSelecionada,
    },
  );

  api.destinations.getIncidents.useQuery(
    { dateRange, turn, destinationId: Number(unidadeSelecionada?.id) },
    { enabled: !!unidadeSelecionada },
  );

  return {
    unidades,
    ocorrenciasQuery,
    unidadeSelecionada,
    setUnidadeSelecionada,
  };
}
