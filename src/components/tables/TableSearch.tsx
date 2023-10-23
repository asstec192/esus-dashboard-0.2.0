import type { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { useRef } from "react";

interface TableSearchProps<TData> {
  table: Table<TData>;
  placeholder?: string;
}

export function TableSearch<TData>({
  table,
  placeholder,
}: TableSearchProps<TData>) {
  const inputRef = useRef();
  return (
    <Input
      placeholder={placeholder}
      value={inputRef.current}
      onChange={(event) => {
        table.setGlobalFilter(event.target.value);
      }}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}
