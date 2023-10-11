import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type Turn = {
  from: string; //hora no formato hh:mm:ss
  to: string; //hora no formato hh:mm:ss
};

type GlobalDateFilterStore = {
  dateRange: DateRange;
  tempDateRange: DateRange;
  turn: Turn;
  tempTurn: Turn;
  setDateRange: () => void;
  setTempDateRange: (dateRange?: DateRange) => void;
  setTurn: (turn: Turn) => void;
  setTempTurn: (turn: Turn) => void;
};

const initialDateRange: DateRange = {
  from: new Date(),
  to: addDays(new Date(), 1),
};
const initialTurn: Turn = {
  from: "",
  to: "",
};

export const useGlogalDateFilterStore = create<GlobalDateFilterStore>()(
  (set) => ({
    dateRange: initialDateRange,
    tempDateRange: initialDateRange,
    turn: initialTurn,
    tempTurn: initialTurn,
    setDateRange: () =>
      set((state) => {
        state.tempDateRange.from!.setHours(1, 0, 0, 0);
        if (!state.tempDateRange.to) {
          state.tempDateRange.to = addDays(state.tempDateRange.from!, 1);
        } else {
          state.tempDateRange.to.setHours(1, 0, 0, 0);
        }
        return { dateRange: state.tempDateRange };
      }),
    setTempDateRange: (dateRange) => set(() => ({ tempDateRange: dateRange })),
    setTurn: (turn) => set(() => ({ turn: turn })),
    setTempTurn: (turn) => set(() => ({ tempTurn: turn })),
  }),
);
