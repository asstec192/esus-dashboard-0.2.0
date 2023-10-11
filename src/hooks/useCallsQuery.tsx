import { toast } from "@/components/ui/use-toast"
import { api } from "@/utils/api"

export const useCallsQuery = () => {
  const query = api.incidents.getTotalIncidentsByCallType.useQuery(undefined, {
    refetchInterval: 5000, //5s
    onError: () => {
      toast({
        title: "Erro",
        variant: "destructive",
        description: "Houve um erro ao gerar o gráfico de ligações!",
      })
    },
  })
  return query
}
