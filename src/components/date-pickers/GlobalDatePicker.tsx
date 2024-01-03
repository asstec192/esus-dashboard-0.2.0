"use client";

import { DateRangePicker } from "@/components/date-pickers/DateRangePicker";
import { Button } from "@/components/ui/button";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";

export const GlobalDatePicker = () => {
  const tempDateRange = useGlogalDateFilterStore(
    (state) => state.tempDateRange,
  );
  const setDateRange = useGlogalDateFilterStore((state) => state.setDateRange);
  const setTempDateRange = useGlogalDateFilterStore(
    (state) => state.setTempDateRange,
  );

  return (
    <div className="z-30 mt-4 grid grid-cols-4 gap-2 px-1 sm:mr-4 sm:self-end sm:px-0 xl:absolute">
      <DateRangePicker
        className="col-span-3"
        dateRange={tempDateRange}
        onSelect={setTempDateRange}
      />
      <Button
        className="col-span-1"
        onClick={setDateRange}
        disabled={!tempDateRange?.from}
      >
        Aplicar
      </Button>
    </div>
  );
};
