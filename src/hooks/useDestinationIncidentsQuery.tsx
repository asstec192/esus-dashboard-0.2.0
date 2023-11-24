import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "./useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";

export const useDestinationIncidentsQuery = (destinyID: number) => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const query = api.destinations.getIncidents.useQuery(
    {
      destinationId: destinyID,
      dateRange,
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
