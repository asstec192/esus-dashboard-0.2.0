import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";

export const useDailyTimesQuery = () => {
  const query = api.responseTimes.getAll.useQuery(undefined, {
    refetchInterval: 5000, //5s
    onError: () => {
      toast({
        title: "Erro",
        variant: "destructive",
        description: "Houve um erro ao buscar as estatísticas diárias!",
      });
    },
  });
  return query;
};
