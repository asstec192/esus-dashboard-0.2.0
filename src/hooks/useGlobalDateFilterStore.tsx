import { addDays, isSameDay } from "date-fns";
import { create } from "zustand";
import * as z from "zod";
import { DateRange as ReactDateRange } from "react-day-picker";

export const turnInput = z.object({
  from: z.string(),
  to: z.string(),
  numericFrom: z.number(),
  numericTo: z.number(),
});
export const dateRangeInput = z.object({ from: z.date(), to: z.date() });
export type Turn = z.infer<typeof turnInput>;
export type DateRange = z.infer<typeof dateRangeInput>;

type GlobalDateFilterStore = {
  dateRange: ReactDateRange;
  tempDateRange: ReactDateRange;
  turn: Turn;
  tempTurn: Turn;
  setDateRange: () => void;
  setTempDateRange: (dateRange?: ReactDateRange) => void;
  setTurn: (turn: Turn) => void;
  setTempTurn: (turn: Turn) => void;
};

const initialDateRange: ReactDateRange = {
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
        //Importante para garantir que nenhuma das datas no date range senha undefined, para evitar erro no backend
        if (
          !state.tempDateRange.to ||
          (state.tempDateRange.from &&
            state.tempDateRange.to &&
            isSameDay(state.tempDateRange.from, state.tempDateRange.to))
        ) {
          state.tempDateRange.to = addDays(state.tempDateRange.from!, 1);
        }
        return { dateRange: state.tempDateRange };
      }),
    setTempDateRange: (dateRange) => set(() => ({ tempDateRange: dateRange })),
    setTurn: (turn) => set(() => ({ turn: turn })),
    setTempTurn: (turn) => set(() => ({ tempTurn: turn })),
  }),
);
