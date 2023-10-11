import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";

export const useRealTimeIncidentQuery = () => {
  const { toast } = useToast();
  const query = api.incidents.getIncidentsInProgress.useQuery(undefined, {
    refetchInterval: 5000,
    onError: (error) => {
      toast({
        title: "Erro ao buscar ocorreências.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return query;
};
