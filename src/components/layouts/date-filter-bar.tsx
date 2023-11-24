import { DateRangePicker } from "@/components/date-picker/date-range-picker";
import { Button } from "@/components/ui/button";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";

export const DateFilterBar = () => {
  const tempDateRange = useGlogalDateFilterStore(
    (state) => state.tempDateRange,
  );
  const setDateRange = useGlogalDateFilterStore((state) => state.setDateRange);
  const setTempDateRange = useGlogalDateFilterStore(
    (state) => state.setTempDateRange,
  );

  return (
    <div className="flex flex-grow flex-wrap gap-2 sm:flex-grow-0 sm:flex-nowrap">
      <DateRangePicker dateRange={tempDateRange} onSelect={setTempDateRange} />
      <Button
        className="w-full sm:w-auto"
        onClick={setDateRange}
        disabled={!tempDateRange?.from}
      >
        Aplicar
      </Button>
    </div>
  );
};
