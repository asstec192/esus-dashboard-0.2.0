import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import { useTurnStore } from "../stores";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

export function useVeiculos() {
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const turn = useTurnStore((state) => state.turn);
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;

  const { data: veiculos } = api.vehicles.getReport.useQuery({
    dateRange,
    turn,
  });

  const { mutate, isLoading: isLoadingOcorrencias } =
    api.vehicles.getIncidents.useMutation({
      onSuccess: setOcorrencias,
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const getOcorrencias = (vehicleId: number) =>
    mutate({ dateRange, turn, vehicleId });

  return { veiculos, isLoadingOcorrencias, getOcorrencias };
}
