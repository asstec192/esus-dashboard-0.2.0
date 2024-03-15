import { create } from "zustand";
import { type Turno, turnos } from "./_components/select-turno";

type TurnoStore = {
  turn: Turno;
  selectedtableItem: string;
  setTurn: (turn: Turno) => void;
  setSeletecTableItem: (item: string) => void;
};

/**
 * Uma store que guarda o estado global para o turno selecionado.
 * Todos os componentes que usarem o valor turno serâo afetados
 * quando o valor for alterado, pois compartilham o mesmo estado.
 */
export const useTurno = create<TurnoStore>()((set) => ({
  turn: turnos[0]!,
  selectedtableItem: "",
  setTurn: (turn) => set(() => ({ turn: turn })),
  setSeletecTableItem: (item) => set(() => ({ selectedtableItem: item })),
}));
