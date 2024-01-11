import { RouterOutputs } from "@/trpc/shared";
import { create } from "zustand";

type Relatorio = RouterOutputs["hospitalManager"]["obterRelatorio"];

type RelatorioStore = {
  relatorio: Relatorio;
  date: Date;
  setRelatorio: (relatorio: Relatorio) => void;
  setDate: (date: Date) => void;
};

export const useGerenciamentoRedeRelatorioStore =
  create<RelatorioStore>()((set) => ({
    relatorio: null,
    date: new Date(),
    setRelatorio: (relatorio) => set({ relatorio }),
    setDate: (date) => set({ date }),
  }));
