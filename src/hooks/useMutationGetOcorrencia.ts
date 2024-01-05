import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useOcorrenciaStore } from "./useOcorrenciaStore";

export const useMutationGetOcorrencia = () => {
  const setOcorrencia = useOcorrenciaStore((state) => state.setOcorrencia);
  const mutation = api.incidents.getOne.useMutation({
    onSuccess:  setOcorrencia,
    onError: (error) =>
      toast({
        description: error.message,
        variant: "destructive",
      }),
  });
  return mutation;
};
