import { RouterOutputs } from "@/trpc/shared";
import { create } from "zustand";

type Ocorrencia = RouterOutputs["incidents"]["getOne"];
type Ocorrencias = RouterOutputs["vehicles"]["getIncidents"];

type OcorrenciaStore = {
  ocorrencia?: Ocorrencia;
  ocorrencias?: Ocorrencias;
  setOcorrencia: (ocorrencia?: Ocorrencia) => void;
  setOcorrencias: (ocorrencias?: Ocorrencias) => void;
};

export const useOcorrenciaStore = create<OcorrenciaStore>()((set) => ({
  ocorrencia: undefined,
  ocorrencias: undefined,
  setOcorrencia: (ocorrencia) => set({ ocorrencia }),
  setOcorrencias: (ocorrencias) => set({ ocorrencias }),
}));
