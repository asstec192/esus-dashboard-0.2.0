import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import { useTurnStore } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

export function useUnidadesDestino() {
  const turn = useTurnStore((state) => state.turn);
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  //busca relatorio das unidades de destino
  const { data: unidades } = api.destinations.getResponseTimes.useQuery({
    dateRange,
    turn,
  });

  //busca as ocorrencias de uma unidade de destino especifica
  const { mutate, isLoading: isLoadingOcorrencias } =
    api.destinations.getIncidents.useMutation({
      onSuccess: setOcorrencias,
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  //wrapper para a mutacao acima
  const getOcorrencias = (destinationId: number) =>
    mutate({ dateRange, turn, destinationId });

  return { unidades, isLoadingOcorrencias, getOcorrencias };
}
