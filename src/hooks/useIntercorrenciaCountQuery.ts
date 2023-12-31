import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "./useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { useTurnStore } from "./useTurnStore";

export const useIntercorrenciaCountQuery = () => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useTurnStore((state) => state.turn);
  return api.intercorrencia.countIncidents.useQuery(
    {
      dateRange,
      turn,
    },
    {
      onError: (error) => {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
};
