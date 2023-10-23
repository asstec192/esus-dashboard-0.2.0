import { toast } from "@/components/ui/use-toast";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/utils/api";

export const useVehicleResponseTimeQuery = () => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useGlogalDateFilterStore((state) => state.turn);
  const query = api.vehicles.getResponseTimes.useQuery(
    { dateRange, turn },
    {
      onError: () => {
        toast({
          title: "Error",
          variant: "destructive",
          description:
            "Erro ao buscar o tempo resposta dos hospitais de destino!",
        });
      },
    },
  );
  return query;
};
