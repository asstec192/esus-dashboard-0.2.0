"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
//@ts-ignore
import commandScore from "command-score";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./scroll-area";
import { getStringScoreMatches } from "@/utils/getStringScoreMatch";

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  options: Option[];
};

export function Combobox({
  options,
  placeholder,
  className,
  onValueChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Selecione"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          value={value}
          filter={(value, search) => getMatches(value, search, options)}
        >
          <CommandInput placeholder={placeholder || "Buscar..."} />
          <ScrollArea className="h-[300px]">
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange && onValueChange(currentValue);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function getMatches(value: string, search: string, options: Option[]) {
  const label = options.find((opt) => opt.value === value)!.label;
  return getStringScoreMatches(label, search);
}
