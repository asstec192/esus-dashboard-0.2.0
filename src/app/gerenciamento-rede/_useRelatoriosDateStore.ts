import { create } from "zustand";

type RelatorioStore = {
  date: Date;
  setDate: (date: Date) => void;
};

export const useRelatoriosDateStore = create<RelatorioStore>()((set) => ({
  date: new Date(),
  setDate: (date) => set({ date }),
}));
