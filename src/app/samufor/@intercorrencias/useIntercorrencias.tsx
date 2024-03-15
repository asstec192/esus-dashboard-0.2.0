import { useTurno } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";
import { useState } from "react";

export function useIntercorrencias() {
  const turn = useTurno((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  //Busca as intercorrencias
  const { data: intercorrencias } =
    api.intercorrencia.countOcorrencias.useQuery({
      dateRange,
      turn,
    });

  const [intercorrenciaSelecionada, setIntercorrenciaSelecionada] =
    useState<RouterOutputs["intercorrencia"]["countOcorrencias"][0]>();

  //busca as ocorrencias e uma intercorrencia especifica
  const ocorrenciasQuery = api.intercorrencia.getOcorrencias.useQuery(
    { dateRange, turn, intercorrenciaId: intercorrenciaSelecionada?.id || 0 },
    {
      enabled: !!intercorrenciaSelecionada,
    },
  );

  return {
    intercorrencias,
    ocorrenciasQuery,
    intercorrenciaSelecionada,
    setIntercorrenciaSelecionada,
  };
}
