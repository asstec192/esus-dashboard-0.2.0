import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type Turn = {
  from: string; //hora no formato hh:mm:ss
  to: string; //hora no formato hh:mm:ss
  numericFrom: number;
  numericTo: number;
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
  from: "1:00:00",
  to: "1:00:00",
  numericFrom: 1,
  numericTo: 1,
};

export const useGlogalDateFilterStore = create<GlobalDateFilterStore>()(
  (set) => ({
    dateRange: initialDateRange,
    tempDateRange: initialDateRange,
    turn: initialTurn,
    tempTurn: initialTurn,
    setDateRange: () =>
      set((state) => {
        if (!state.tempDateRange.to) {
          state.tempDateRange.to = addDays(state.tempDateRange.from!, 1);
        }
        return { dateRange: state.tempDateRange };
      }),
    setTempDateRange: (dateRange) => set(() => ({ tempDateRange: dateRange })),
    setTurn: (turn) => set(() => ({ turn: turn })),
    setTempTurn: (turn) => set(() => ({ tempTurn: turn })),
  }),
);
