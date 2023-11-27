import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "./useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { useTurnStore } from "./useTurnStore";

export const useDestinationIncidentsQuery = (destinyID: number) => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useTurnStore((state) => state.turn);
  const query = api.destinations.getIncidents.useQuery(
    {
      destinationId: destinyID,
      dateRange,
      turn,
    },
    {
      enabled: destinyID !== 0,
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
