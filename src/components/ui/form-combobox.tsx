"use client";

//@ts-ignore
import commandScore from "command-score";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./scroll-area";

export type ComboboxOption<T extends FieldValues> = {
  label: string;
  value: PathValue<T, Path<T>>;
};

type FormComboboxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  description?: string;
  className?: string;
  withErrorMessage?: boolean;
  disabled?: boolean;
  options: ComboboxOption<T>[];
  onValueChange?: (value: ComboboxOption<T>) => void;
};

export function FormCombobox<T extends FieldValues>({
  form,
  name,
  options,
  emptyMessage,
  className,
  placeholder,
  description,
  disabled,
  label,
  withErrorMessage = false,
  onValueChange,
}: FormComboboxProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={disabled}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)
                        ?.label
                    : "Selecione"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] p-0">
              <Command filter={filterOptions}>
                <CommandInput
                  placeholder={placeholder ?? "Buscar..."}
                  className="h-9"
                />
                <ScrollArea className="h-[300px]">
                  <CommandEmpty>
                    {emptyMessage ?? "Nenhum resultado."}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          form.watch(name) === option.value
                            ? form.resetField(name)
                            : form.setValue(name, option.value);
                          onValueChange?.(option);
                        }}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}

          {withErrorMessage ? <FormMessage /> : null}
        </FormItem>
      )}
    />
  );
}

// função de filtragem
const filterOptions = (value: string, search: string) => {
  const normalizedValue = value.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
  const normalizedSearch = search.normalize("NFD").replace(/[^a-zA-Z\s]/g, "");
  return commandScore(normalizedValue, normalizedSearch) as number;
};
