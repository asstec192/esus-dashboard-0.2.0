import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";

interface DateRangePickerProps {
  defaultMonth?: Date;
  dateRange?: DateRange;
  onSelect?: SelectRangeEventHandler;
  className?: string;
}

export function DateRangePicker({
  defaultMonth,
  dateRange,
  onSelect,
  className,
}: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "justify-start font-normal",
            !dateRange && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y", { locale: ptBR })
            )
          ) : (
            <span>Escolha uma data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={defaultMonth}
          selected={dateRange}
          onSelect={onSelect}
          numberOfMonths={2}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
