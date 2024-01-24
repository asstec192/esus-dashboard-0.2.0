import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useRegulacaoSecundariaStore } from "../stores";

export function useVeiculos() {
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data: veiculos } = api.veiculos.getTempoResposta.useQuery({
    dateRange,
    turn,
  });

  const [veiculoSelecionado, setVeiculoSelecionado] =
    useState<NonNullable<typeof veiculos>[0]>();

  const ocorrenciasQuery = api.veiculos.getOcorrencias.useQuery(
    {
      dateRange,
      turn,
      veiculoId: veiculoSelecionado?.id || 0,
    },
    {
      enabled: !!veiculoSelecionado,
    },
  );

  return {
    veiculos,
    ocorrenciasQuery,
    veiculoSelecionado,
    setVeiculoSelecionado,
  };
}
