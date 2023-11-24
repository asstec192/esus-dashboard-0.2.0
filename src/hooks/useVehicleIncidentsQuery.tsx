import { api } from "@/utils/api";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "./useGlobalDateFilterStore";
import { toast } from "@/components/ui/use-toast";

export const useVehicleIncidentsQuery = (vehicleID: number) => {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const query = api.vehicles.getIncidents.useQuery(
    {
      vehicleId: vehicleID,
      dateRange,
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
