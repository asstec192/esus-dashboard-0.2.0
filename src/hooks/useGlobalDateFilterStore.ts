import { addDays, isSameDay } from "date-fns";
import { create } from "zustand";
import * as z from "zod";
import { DateRange as ReactDateRange } from "react-day-picker";
import { dateRangeSchema } from "@/constants/zod-schemas";

export type DateRange = z.infer<typeof dateRangeSchema>;

type GlobalDateFilterStore = {
  dateRange: ReactDateRange;
  tempDateRange: ReactDateRange;
  setDateRange: () => void;
  setTempDateRange: (dateRange?: ReactDateRange) => void;
};

const initialDateRange: ReactDateRange = {
  from: new Date(),
  to: addDays(new Date(), 1),
};

export const useGlogalDateFilterStore = create<GlobalDateFilterStore>()(
  (set) => ({
    dateRange: initialDateRange,
    tempDateRange: initialDateRange,
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
  }),
);
