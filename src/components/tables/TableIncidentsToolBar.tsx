import { type Table } from "@tanstack/react-table";
import { TableSearch } from "./TableSearch";
import { TableFilter } from "./TableFilter";
import { TypographyMuted } from "../typography/TypographyMuted";

interface TableIncidentsToolBarProps<TData> {
  table: Table<TData>;
}

export function TableIncidentsToolBar<TData>({
  table,
}: TableIncidentsToolBarProps<TData>) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <TableSearch table={table} placeholder="Buscar ocorrências" />
      {table.getColumn("risco") && (
        <TableFilter
          column={table.getColumn("risco")}
          title="Risco"
          options={[
            { label: "Vermelho", value: "1" },
            { label: "Amarelo", value: "2" },
            { label: "Verde", value: "3" },
            { label: "Azul", value: "4" },
          ]}
        />
      )}

      {table.getColumn("filtro-sexo") && (
        <TableFilter
          column={table.getColumn("filtro-sexo")}
          title="Sexo"
          options={[
            { label: "Maculino", value: "1" },
            { label: "Feminino", value: "2" },
          ]}
        />
      )}

      {table.getColumn("filtro-idade") && (
        <TableFilter
          column={table.getColumn("filtro-idade")}
          title="Idade"
          options={[
            { label: "<13", value: JSON.stringify({ min: 0, max: 12 }) },
            { label: "13-18", value: JSON.stringify({ min: 13, max: 18 }) },
            { label: "19-29", value: JSON.stringify({ min: 19, max: 29 }) },
            { label: "30-39", value: JSON.stringify({ min: 30, max: 39 }) },
            { label: "40-49", value: JSON.stringify({ min: 40, max: 49 }) },
            { label: "50-59", value: JSON.stringify({ min: 50, max: 59 }) },
            { label: ">59", value: JSON.stringify({ min: 60, max: 10000 }) },
          ]}
        />
      )}

      {table.getColumn("filtro-dia") && (
        <TableFilter
          column={table.getColumn("filtro-dia")}
          title="Dia da semana"
          options={[
            { label: "Dom", value: "0" },
            { label: "Seg", value: "1" },
            { label: "Ter", value: "2" },
            { label: "Qua", value: "3" },
            { label: "Qui", value: "4" },
            { label: "Sex", value: "5" },
            { label: "Sáb", value: "6" },
          ]}
        />
      )}

      {table.getColumn("filtro-hora") && (
        <TableFilter
          column={table.getColumn("filtro-hora")}
          title="Horário de deslocamento"
          options={[
            { label: "7h-10h", value: JSON.stringify({ min: 7, max: 10 }) },
            { label: "10h-13h", value: JSON.stringify({ min: 10, max: 13 }) },
            { label: "13h-16h", value: JSON.stringify({ min: 13, max: 16 }) },
            { label: "16h-19h", value: JSON.stringify({ min: 16, max: 19 }) },
            { label: "19h-22h", value: JSON.stringify({ min: 19, max: 22 }) },
            { label: "22h-1h", value: JSON.stringify({ min: 22, max: 1 }) },
            { label: "1h-4h", value: JSON.stringify({ min: 1, max: 4 }) },
            { label: "4h-7h", value: JSON.stringify({ min: 4, max: 7 }) },
          ]}
        />
      )}
      <TypographyMuted className="w-full">
        A busca retornou {table.getFilteredRowModel().rows.length} resultados
      </TypographyMuted>
    </div>
  );
}
