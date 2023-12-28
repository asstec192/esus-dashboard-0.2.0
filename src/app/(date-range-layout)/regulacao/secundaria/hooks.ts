import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

export const useMutationOcorrenciasDoVeiculo = () =>
  api.vehicles.getIncidents.useMutation({
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });

export const useMutationOcorrenciasDaUnidadeDestino = () =>
  api.destinations.getIncidents.useMutation({
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });

export const useMutationOcorrenciasDaIntercorrencia = () =>
  api.intercorrencia.getIncidents.useMutation({
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
