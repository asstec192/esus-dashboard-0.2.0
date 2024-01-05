import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import { useTurnStore } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

export function useIntercorrencias() {
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const turn = useTurnStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  //Busca as intercorrencias
  const { data: intercorrencias } = api.intercorrencia.countIncidents.useQuery({
    dateRange,
    turn,
  });

  //busca as ocorrencias e uma intercorrencia especifica
  const { mutate, isLoading: isLoadingOcorrencias } =
    api.intercorrencia.getIncidents.useMutation({
      onSuccess: setOcorrencias,
      onError: (error) => {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  //wrapper para a mutacao acima
  const getOcorrencias = (intercorrenciaId: number) =>
    mutate({ dateRange, turn, intercorrenciaId });

  return {
    intercorrencias,
    isLoadingOcorrencias,
    getOcorrencias,
  };
}
