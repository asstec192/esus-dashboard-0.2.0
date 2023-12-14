import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Input } from "../ui/input";
import { useDataTable } from "./DataTableContext";
import { StringParam, useQueryParam } from "use-query-params";

export function DataTableSearch() {
  const { table } = useDataTable();
  const [search, setSearch] = useQueryParam("search", StringParam);
  const [inputValue, setInputValue] = useState(search || "");
  const debounceSetSearch = useMemo(() => debounce(setSearch, 100), []);

  //atualiza o valor da busca na url
  useEffect(() => {
    if (inputValue.trim() === "") debounceSetSearch("");
    else debounceSetSearch(inputValue);
  }, [inputValue]);

  //busca e filtra quando o valor muda
  useEffect(() => {
    table.setGlobalFilter(search);
  }, [search]);
  return (
    <Input
      placeholder="Buscar..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}
