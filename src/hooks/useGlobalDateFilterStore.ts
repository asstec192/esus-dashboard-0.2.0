import type { DateRange as ReactDateRange } from "react-day-picker";
import type { z } from "zod";
import {
  addDays,
  isSameDay,
  startOfDay,
  startOfToday,
  startOfTomorrow,
} from "date-fns";
import { create } from "zustand";

import type { SchemaDateRange } from "@/validators";

export type DateRange = z.infer<typeof SchemaDateRange>;

type GlobalDateFilterStore = {
  dateRange: ReactDateRange;
  tempDateRange: ReactDateRange;
  setDateRange: () => void;
  setTempDateRange: (dateRange?: ReactDateRange) => void;
};

const initialDateRange: ReactDateRange = {
  from: startOfToday(),
  to: startOfTomorrow(),
};

export const useGlogalDateFilterStore = create<GlobalDateFilterStore>()(
  (set) => ({
    dateRange: initialDateRange,
    tempDateRange: initialDateRange,
    setDateRange: () =>
      set((state) => {
        //Importante para garantir que nenhuma das datas no date range senha undefined, para evitar erro no backend
        const isOnlyStartDateSelected = !state.tempDateRange.to;

        const isStartAndEndDateTheSameDay =
          state.tempDateRange.to &&
          state.tempDateRange.from &&
          isSameDay(state.tempDateRange.from, state.tempDateRange.to);

        if (isOnlyStartDateSelected || isStartAndEndDateTheSameDay) {
          state.tempDateRange.to = addDays(state.tempDateRange.from!, 1);
        }

        return {
          dateRange: {
            from: startOfDay(state.tempDateRange.from!),
            to: startOfDay(state.tempDateRange.to!),
          },
        };
      }),
    setTempDateRange: (dateRange) => set(() => ({ tempDateRange: dateRange })),
  }),
);
