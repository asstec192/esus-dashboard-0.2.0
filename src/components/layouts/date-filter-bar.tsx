import { usePathname } from "next/navigation";
import { DateRangePicker } from "@/components/date-picker/date-range-picker";
import { Button } from "@/components/ui/button";
import { TurnSelect } from "@/components/select/select-turn";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";

export const DateFilterBar = () => {
  const pathname = usePathname();
  const tempDateRange = useGlogalDateFilterStore(
    (state) => state.tempDateRange,
  );
  const tempTurn = useGlogalDateFilterStore((state) => state.tempTurn);
  const setTempTurn = useGlogalDateFilterStore((state) => state.setTempTurn);
  const setTurn = useGlogalDateFilterStore((state) => state.setTurn);
  const setDateRange = useGlogalDateFilterStore((state) => state.setDateRange);
  const setTempDateRange = useGlogalDateFilterStore(
    (state) => state.setTempDateRange,
  );

  const handleSubmitSearch = () => {
    setDateRange();
    setTurn(tempTurn);
  };

  return (
    <div className="flex flex-grow flex-wrap gap-2 sm:flex-grow-0 sm:flex-nowrap">
      {pathname === "/regulacao-secundaria" && (
        <TurnSelect onValueChange={(value) => setTempTurn(JSON.parse(value))} />
      )}
      <DateRangePicker dateRange={tempDateRange} onSelect={setTempDateRange} />
      <Button onClick={handleSubmitSearch} disabled={!tempDateRange?.from}>
        Aplicar
      </Button>
    </div>
  );
};
