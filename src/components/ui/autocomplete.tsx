"use client";

import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useEffect,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
} from "react";

import { cn } from "@/lib/utils";
import { Check, Search } from "lucide-react";
import { Skeleton } from "./skeleton";
import { filterComboboxOptions } from "@/utils/filterComboboxOptions";
import { ComboboxOption } from "./form-combobox";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

type AutoCompleteProps<T extends FieldValues> = {
  options: ComboboxOption<T>[];
  emptyMessage?: string;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
  withErrorMessage?: boolean;
  tabIndex?: number;
  onValueChange?: (value: ComboboxOption<T>) => void;
};

export function AutoComplete<T extends FieldValues>({
  options,
  placeholder,
  emptyMessage,
  disabled,
  isLoading = false,
  name,
  form,
  className,
  description,
  label,
  withErrorMessage,
  tabIndex,
  onValueChange,
}: AutoCompleteProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSelectValue = useCallback(
    (selectedValue: ComboboxOption<T>["value"]) => {
      // clears the value when reselecting the same option
      form.watch(name) === selectedValue
        ? form.resetField(name)
        : form.setValue(name, selectedValue);

      onValueChange?.(selectedValue);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [],
  );

  useEffect(() => {
    const selectedOption = options.find(
      (option) => option.value === form.watch(name),
    );
    setInputValue(selectedOption?.label ?? "");
  }, [form.watch(name)]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <CommandPrimitive
              onKeyDown={handleKeyDown}
              filter={filterComboboxOptions}
            >
              <div>
                <AutoCompleteInput
                  ref={inputRef}
                  value={inputValue}
                  onValueChange={isLoading ? undefined : setInputValue}
                  onBlur={handleBlur}
                  onFocus={() => setOpen(true)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="text-base"
                  tabIndex={tabIndex}
                />
              </div>
              <div className="relative mt-1">
                {isOpen ? (
                  <div className="absolute top-0 z-10 w-full rounded-xl bg-background outline-none animate-in fade-in-0 zoom-in-95">
                    <CommandList className="rounded-lg ring-1 ring-ring">
                      {isLoading ? (
                        <CommandPrimitive.Loading>
                          <div className="p-1">
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </CommandPrimitive.Loading>
                      ) : null}
                      {options.length > 0 && !isLoading ? (
                        <CommandGroup>
                          {options.map((option) => {
                            const isSelected = option.value === field.value;
                            return (
                              <CommandItem
                                key={option.value}
                                value={option.label}
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                }}
                                onSelect={() => handleSelectValue(option.value)}
                                className={cn(
                                  "flex w-full items-center gap-2",
                                  !isSelected ? "pl-8" : null,
                                )}
                              >
                                {isSelected ? <Check className="w-4" /> : null}
                                {option.label}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      ) : null}
                      {!isLoading ? (
                        <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                          {emptyMessage ?? "Nenhum resultado."}
                        </CommandPrimitive.Empty>
                      ) : null}
                    </CommandList>
                  </div>
                ) : null}
              </div>
            </CommandPrimitive>
          </FormControl>
          {withErrorMessage ? <FormMessage /> : null}
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
        </FormItem>
      )}
    />
  );
}

const AutoCompleteInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center rounded border px-3" cmdk-input-wrapper="">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
  </div>
));
