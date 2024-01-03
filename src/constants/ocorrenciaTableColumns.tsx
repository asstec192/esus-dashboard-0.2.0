import { Button } from "@/components/ui/button";
import { RouterOutputs } from "@/trpc/shared";
import { ColumnDef } from "@tanstack/react-table";
import { riskColors } from "./riskColors";
import { formatProperName } from "@/utils/formatProperName";
import { PopoverVeiculo } from "@/components/popovers/VeiculoPopover";
import { formatDate } from "@/utils/formatDate";
import { getDay } from "date-fns";
import { isWithinHour } from "@/utils/isWithinTurn";
import { isBelowOneYear } from "@/utils/isBelowOneYear";
import { useMutationGetOcorrencia } from "@/hooks/useMutationGetOcorrencia";

type NumberRange = {
  min: number;
  max: number;
};

export const ocorrenciaTableColumns: ColumnDef<
  RouterOutputs["incidents"]["getAll"][0]
>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => {
      const { mutate } = useMutationGetOcorrencia();
      return (
        <Button
          variant="link"
          className="!p-0 underline"
          style={{ color: riskColors[row.original.risco] }}
          onClick={() => mutate({ incidentId: Number(row.original.id) })}
        >
          {row.original.id}
        </Button>
      );
    },
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ row }) => <p className="font-semibold">{row.original.motivo}</p>,
  },
  {
    accessorKey: "operador",
    header: "Operador",
    cell: ({ row }) => formatProperName(row.original.operador),
  },
  {
    accessorKey: "bairro",
    header: "Bairro",
    cell: ({ row }) => formatProperName(row.original.bairro),
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
    header: () => null,
    cell: () => null,
    accessorFn: ({ veiculos }) =>
      veiculos.map((veiculo) => veiculo.nome).toString(),
  },
  {
    accessorKey: "risco",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value: string[]) => {
      const risco = row.original.risco;
      return value.includes(risco.toString());
    },
  },
  {
    id: "filtro-pacientes",
    header: () => null,
    cell: () => null,
    accessorFn: ({ pacientes }) =>
      pacientes.map((paciente) => paciente.nome).toString(),
  },
  {
    id: "filtro-sexo",
    accessorKey: "pacientes",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, selectedSexs: string[]) => {
      const pacientes = row.original.pacientes;
      return pacientes.some(
        (paciente) => paciente.sexo && selectedSexs.includes(paciente.sexo),
      );
    },
  },
  {
    id: "filtro-idade",
    accessorKey: "pacientes",
    header: () => null,
    cell: () => null,
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
    header: () => null,
    cell: () => null,
    filterFn: (row, id, selectedWeekDays: string[]) => {
      const date = row.original.data;
      const formatedDate = formatDate(date, "yyyy-MM-dd HH:mm:ss");
      const newDate = new Date(formatedDate);
      const weekDay = getDay(newDate).toString();
      return selectedWeekDays.includes(weekDay);
    },
  },
  {
    id: "filtro-hora",
    header: () => null,
    cell: () => null,
    accessorKey: "veiculos",
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
