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
  const { data: unidades } = api.destinos.getTempoResposta.useQuery({
    dateRange,
    turn,
  });

  const [unidadeSelecionada, setUnidadeSelecionada] =
    useState<RouterOutputs["destinos"]["getTempoResposta"][0]>();

  //busca as ocorrencias de uma unidade de destino especifica
  const ocorrenciasQuery = api.destinos.getOcorrencias.useQuery(
    {
      dateRange,
      destinoId: Number(unidadeSelecionada?.id),
      turn,
    },
    {
      enabled: !!unidadeSelecionada,
    },
  );

  api.destinos.getOcorrencias.useQuery(
    { dateRange, turn, destinoId: Number(unidadeSelecionada?.id) },
    { enabled: !!unidadeSelecionada },
  );

  return {
    unidades,
    ocorrenciasQuery,
    unidadeSelecionada,
    setUnidadeSelecionada,
  };
}
