import { create } from "zustand";
import * as z from "zod";
import { turnos } from "@/utils/turnos";

export const turnInput = z.object({
  from: z.string(),
  to: z.string(),
  numericFrom: z.number(),
  numericTo: z.number(),
  label: z.string(),
});

export type Turn = z.infer<typeof turnInput>;
type TurnStore = {
  turn: Turn;
  setTurn: (turn: Turn) => void;
};

export const useTurnStore = create<TurnStore>()((set) => ({
  turn: turnos[0]!,
  setTurn: (turn) => set(() => ({ turn: turn })),
}));
