import { RouterOutputs } from "@/trpc/shared";
import { create } from "zustand";

type Relatorio = RouterOutputs["hospitalManager"]["obterRelatorio"];

type RelatorioStore = {
  open: boolean;
  relatorio: Relatorio;
  date: Date;
  setOpen: (value: boolean) => void;
  setRelatorio: (relatorio: Relatorio) => void;
  setDate: (date: Date) => void;
};

export const useGerenciamentoRedeRelatorioStore =
  create<RelatorioStore>()((set) => ({
    open: false,
    relatorio: null,
    date: new Date(),
    setOpen: (open) => set({ open }),
    setRelatorio: (relatorio) => set({ relatorio }),
    setDate: (date) => set({ date }),
  }));
