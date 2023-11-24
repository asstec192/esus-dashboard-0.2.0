import { create } from "zustand";
import * as z from "zod";

export const turnInput = z.object({
  from: z.string(),
  to: z.string(),
  numericFrom: z.number(),
  numericTo: z.number(),
});

export type Turn = z.infer<typeof turnInput>;
type TurnStore = {
  turn: Turn;
  vehicleTurn: Turn;
  setTurn: (turn: Turn) => void;
  setVehicleTurn: (turn: Turn) => void;
};

const initialTurn: Turn = {
  from: "01:00:00",
  to: "01:00:00",
  numericFrom: 1,
  numericTo: 1,
};

const initialVehicleTurn: Turn = {
  from: "07:00:00",
  to: "07:00:00",
  numericFrom: 7,
  numericTo: 7,
};

export const useTurnStore = create<TurnStore>()((set) => ({
  turn: initialTurn,
  vehicleTurn: initialVehicleTurn,
  setTurn: (turn) => set(() => ({ turn: turn })),
  setVehicleTurn: (turn) => set(() => ({ vehicleTurn: turn })),
}));
