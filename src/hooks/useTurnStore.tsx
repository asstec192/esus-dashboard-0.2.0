import { create } from "zustand";
import * as z from "zod";

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

const initialTurn: Turn = {
  from: "01:00:00",
  to: "01:00:00",
  numericFrom: 1,
  numericTo: 1,
  label: "Todos",
};

export const useTurnStore = create<TurnStore>()((set) => ({
  turn: initialTurn,
  setTurn: (turn) => set(() => ({ turn: turn })),
}));
