import { create } from "zustand";
import { Turno, turnos } from "@/constants/turnos";

type TurnStore = {
  turn: Turno;
  setTurn: (turn: Turno) => void;
};

export const useTurnStore = create<TurnStore>()((set) => ({
  turn: turnos[0]!,
  setTurn: (turn) => set(() => ({ turn: turn })),
}));
