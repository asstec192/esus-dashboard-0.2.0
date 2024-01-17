import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRegulacaoSecundariaStore } from "../stores";

export function useVeiculos() {
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const { data: veiculos } = api.vehicles.getReport.useQuery({
    dateRange,
    turn,
  });

  const [veiculoSelecionado, setVeiculoSelecionado] =
    useState<NonNullable<typeof veiculos>[0]>();

  const ocorrenciasQuery = api.vehicles.getIncidents.useQuery(
    {
      dateRange,
      turn,
      vehicleId: veiculoSelecionado?.id || 0,
    },
    {
      enabled: !!veiculoSelecionado,
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
    veiculos,
    ocorrenciasQuery,
    veiculoSelecionado,
    setVeiculoSelecionado,
  };
}
