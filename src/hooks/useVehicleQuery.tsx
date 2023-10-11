import { toast } from "@/components/ui/use-toast";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/utils/api";

export const useVehicleQuery = () => {
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const turn = useGlogalDateFilterStore((state) => state.turn);
  const query = api.responseTimes.getResponseTimeByVehicle.useQuery(
    { from: dateRange.from!, to: dateRange.to!, turn },
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
