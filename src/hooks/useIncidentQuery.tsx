import { useToast } from "@/components/ui/use-toast";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { api } from "@/utils/api";

export const useIncidentQuery = () => {
  const { toast } = useToast();
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const query = api.incidents.getAll.useQuery(
    { from: dateRange.from!, to: dateRange.to! },
    {
      staleTime: 60 * 60 * 1000, //60 min
      cacheTime: 65 * 60 * 1000, //65 min
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
  return query;
};
