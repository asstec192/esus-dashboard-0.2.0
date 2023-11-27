import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "./useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";
import { useTurnStore } from "./useTurnStore";

export const useVehicleIncidentsQuery = (vehicleID: number) => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useTurnStore(state=> state.turn)
  const query = api.vehicles.getIncidents.useQuery(
    {
      vehicleId: vehicleID,
      dateRange,
      turn
    },
    {
      enabled: vehicleID !== 0,
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
