import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"

export function useIncidentTable<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchValue, setSearchValue] = useState("")

  const table = useReactTable({
    data, //propriedade obrigatoria
    columns, //propriedade obrigatoria
    initialState: { pagination: { pageSize: 20 } },
    state: {
      columnFilters,
      globalFilter: searchValue,
    },
    onColumnFiltersChange: setColumnFilters, //filtra a tabela
    getCoreRowModel: getCoreRowModel(), //propriedade obrigatoria
    getFilteredRowModel: getFilteredRowModel(), //habilita filtragem
    getPaginationRowModel: getPaginationRowModel(), //habilita paginacao
    getFacetedUniqueValues: getFacetedUniqueValues(), // exibe a quantidade total de cada opçao do filtro
  })

  return { table, searchValue, setSearchValue }
}
