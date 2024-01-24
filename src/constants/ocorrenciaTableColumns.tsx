import { Button } from "@/components/ui/button";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";
import { formatProperName } from "@/utils/formatProperName";
import { PopoverVeiculo } from "@/components/popovers/PopoverVeiculo";
import { addHours, getDay } from "date-fns";
import { isWithinHour } from "@/utils/isWithinTurn";
import { isBelowOneYear } from "@/utils/isBelowOneYear";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NumberRange = {
  min: number;
  max: number;
};

export const ocorrenciaTableColumns: ColumnDef<
  RouterOutputs["ocorrencias"]["getAll"][0]
>[] = [
  {
    accessorKey: "id",
    header: "Ocorrência",
    meta: { className: "w-full max-w-0 sm:w-auto sm:max-w-none" },
    cell: ({ row }) => (
      <>
        <Button
          variant="link"
          className={cn(`!p-0 ${row.original.riscoColorClass.text} underline`)}
          asChild
        >
          <Link
            href={{ query: { ocorrenciaId: row.original.id } }}
            scroll={false}
          >
            #{row.original.id}
          </Link>
        </Button>
        <dd className="truncate text-xs md:hidden">{row.original.motivo}</dd>
        <TypographyMuted className="truncate sm:hidden">
          {formatProperName(row.original.bairro)}
        </TypographyMuted>
      </>
    ),
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ row }) => row.original.motivo,
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "operador",
    header: "Operador",
    cell: ({ row }) => formatProperName(row.original.operador),
    meta: { className: "hidden md:table-cell" },
  },
  {
    accessorKey: "bairro",
    header: "Bairro",
    cell: ({ row }) => formatProperName(row.original.bairro),
    meta: { className: "hidden sm:table-cell" },
  },
  {
    accessorKey: "veiculos",
    header: "Veículos",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.veiculos.map((v) => (
          <PopoverVeiculo veiculo={v} key={`pop-veiculo-${v.nome}`} />
        ))}
      </div>
    ),
  },
  //------------COLUNAS OCULTAS, USADAS APENAS PARA FINS DE FILTRAGEM----------------//
  {
    id: "filtro-veiculo",
    header: "",
    cell: "",
    accessorFn: ({ veiculos }) =>
      veiculos.map((veiculo) => veiculo.nome).toString(),
    meta: { className: "hidden" },
  },
  {
    accessorKey: "risco",
    header: "",
    cell: "",
    filterFn: (row, id, value: string[]) => {
      const risco = row.original.risco;
      return value.includes(risco.toString());
    },
    meta: { className: "hidden" },
  },
  {
    id: "filtro-pacientes",
    header: "",
    cell: "",
    accessorFn: ({ pacientes }) =>
      pacientes.map((paciente) => paciente.nome).toString(),
    meta: { className: "hidden" },
  },
  {
    id: "filtro-sexo",
    accessorKey: "pacientes",
    header: "",
    cell: "",
    filterFn: (row, id, selectedSexs: string[]) => {
      const pacientes = row.original.pacientes;
      return pacientes.some(
        (paciente) => paciente.sexo && selectedSexs.includes(paciente.sexo),
      );
    },
    meta: { className: "hidden" },
  },
  {
    id: "filtro-idade",
    accessorKey: "pacientes",
    header: "",
    cell: "",
    meta: { className: "hidden" },
    filterFn: (row, id, ageRanges: string[]) => {
      const pacientes = row.original.pacientes;
      const ranges = ageRanges.map((range) => JSON.parse(range) as NumberRange);
      return pacientes.some((paciente) => {
        if (!paciente.idade) {
          return false;
        }
        return ranges.some(({ min, max }) => {
          //retorna os pacientes menores de 1 um ano quando seleciona o filtro menor de 13 anos
          if (max === 12 && isBelowOneYear(paciente)) return true;
          //demais filtros
          return paciente.idade! >= min && paciente.idade! <= max;
        });
      });
    },
  },
  {
    id: "filtro-dia",
    accessorKey: "data",
    header: "",
    cell: "",
    meta: { className: "hidden" },
    filterFn: (row, id, selectedWeekDays: string[]) => {
      const timeZoneOffset = row.original.data.getTimezoneOffset() / 60;
      const date = addHours(row.original.data, timeZoneOffset);
      const weekDay = getDay(date).toString();
      return selectedWeekDays.includes(weekDay);
    },
  },
  {
    id: "filtro-hora",
    header: "",
    cell: "",
    accessorKey: "veiculos",
    meta: { className: "hidden" },
    filterFn: (row, id, selectedHours: string[]) => {
      const veiculos = row.original.veiculos;
      if (veiculos.length === 0) {
        return false;
      }
      const primeiroEnvio = new Date(veiculos[0]!.EnvioEquipeDT);
      return selectedHours.some((hourRange) => {
        const startHour = (JSON.parse(hourRange) as NumberRange).min;
        const endHour = (JSON.parse(hourRange) as NumberRange).max;
        return isWithinHour(primeiroEnvio, startHour, endHour);
      });
    },
  },
];
