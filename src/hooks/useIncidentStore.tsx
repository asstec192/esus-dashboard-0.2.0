import { type Ocorrencia } from "@/lib/ocorrencias";
import { create } from "zustand";

type IncidentStore = {
  modalIncident?: Ocorrencia;
  setModalIncident: (incident?: Ocorrencia) => void;
};

export const useIncidentStore = create<IncidentStore>()((set) => ({
  modalIncident: undefined,
  setModalIncident: (incident) => set(() => ({ modalIncident: incident })),
}));
