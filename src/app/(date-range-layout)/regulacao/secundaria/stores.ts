import { create } from "zustand";
import { Turno, turnos } from "./components/select-turno";

type RegulacaoSecundariaStore = {
  turn: Turno;
  selectedtableItem: string;
  setTurn: (turn: Turno) => void;
  setSeletecTableItem: (item: string) => void;
};

export const useRegulacaoSecundariaStore = create<RegulacaoSecundariaStore>()(
  (set) => ({
    turn: turnos[0]!,
    selectedtableItem: "",
    setTurn: (turn) => set(() => ({ turn: turn })),
    setSeletecTableItem: (item) => set(() => ({ selectedtableItem: item })),
  }),
);
