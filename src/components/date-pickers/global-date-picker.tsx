"use client";

import { Button } from "@/components/ui/button";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { cn } from "@/lib/utils";
import { DateRangePicker } from "./date-range-picker";

export const GlobalDatePicker = ({ className }: { className?: string }) => {
  const tempDateRange = useGlogalDateFilterStore(
    (state) => state.tempDateRange,
  );
  const setDateRange = useGlogalDateFilterStore((state) => state.setDateRange);
  const setTempDateRange = useGlogalDateFilterStore(
    (state) => state.setTempDateRange,
  );

  return (
    <div className={cn("grid max-w-sm grid-cols-4 gap-2", className)}>
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
