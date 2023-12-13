import { useRef } from "react";
import { Input } from "../ui/input";
import { useDataTable } from "./DataTableContext";

export function DataTableSearch() {
  const { table } = useDataTable();
  const inputRef = useRef();
  return (
    <Input
      placeholder="Buscar..."
      value={inputRef.current}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}
