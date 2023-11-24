import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "./useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";

export const useIntercorrenciaIncidentsQuery = (intercorrenciaId: number) => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const query = api.intercorrencia.getIncidents.useQuery(
    {
      intercorrenciaId,
      dateRange,
    },
    {
      enabled: intercorrenciaId !== 0,
      onError: (error) => {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
  return query;
};
