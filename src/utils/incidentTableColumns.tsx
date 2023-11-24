import { type ColumnDef } from "@tanstack/react-table";
import { formatProperName } from "@/utils/formatProperName";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { getDay } from "date-fns";
import { formatDate } from "@/utils/formatDate";
import { isWithinHour } from "@/utils/isWithinTurn";
import { PopoverVehicleForRawQuery } from "../components/pop-overs/PopoverVehicleForRawQuery";
import { Button } from "@/components/ui/button";
import { useIncidentStore } from "@/hooks/useIncidentStore";
import { isBelowOneYear } from "./isBelowOneYear";

type NumberRange = {
  min: number;
  max: number;
};

export const incidentTableColumns: ColumnDef<Ocorrencia>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      const risco: number = row.getValue("risco");
      const riskColor = getColorByRisk(risco);
      const setSelectedIncidentId = useIncidentStore(
        (state) => state.setSelectedIncidentId,
      );
      return (
        <Button
          variant="link"
          className="font-semibold underline"
          size="sm"
          style={{ color: riskColor }}
          onClick={() => setSelectedIncidentId(parseInt(row.original.id))}
        >
          {id}
        </Button>
      );
    },
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ row }) => {
      const motivo: string | null = row.getValue("motivo");
      return <div className="font-bold">{motivo}</div>;
    },
  },
  {
    accessorKey: "operador",
    header: "Médico regulador",
    cell: ({ row }) => {
      const operador: string = row.getValue("operador");
      return <div>{formatProperName(operador)}</div>;
    },
  },
  {
    accessorKey: "bairro",
    header: "Bairro",
    cell: ({ row }) => {
      const bairro: string = row.getValue("bairro");
      return <div>{formatProperName(bairro)}</div>;
    },
  },
  {
    accessorKey: "veiculos",
    header: "Veículos",
    cell: ({ row }) => {
      const veiculos: Veiculo[] = row.getValue("veiculos");
      return (
        <div className="flex flex-wrap gap-2">
          {veiculos.map((veiculo) => (
            <PopoverVehicleForRawQuery veiculo={veiculo} />
          ))}
        </div>
      );
    },
  },
  //------------COLUNAS OCULTAS, USADAS APENAS PARA FINS DE FILTRAGEM----------------//
  {
    id: "filtro-veiculo",
    header: () => null,
    cell: () => null,
    accessorFn: ({ veiculos }) => {
      let output = "";
      veiculos.forEach((veiculo) => (output = output + veiculo.nome));
      return output;
    },
  },
  {
    accessorKey: "risco",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value: string[]) => {
      const risco: number = row.getValue(id);
      return value.includes(risco.toString());
    },
  },
  {
    id: "filtro-pacientes",
    header: () => null,
    cell: () => null,
    accessorFn: ({ pacientes }) => {
      let output = "";
      pacientes.forEach((paciente) => (output = output + paciente.nome + " "));
      return output;
    },
  },
  {
    id: "filtro-sexo",
    accessorKey: "pacientes",
    header: () => null,
    cell: () => null,
    filterFn: (row, id, selectedSexs: string[]) => {
      const pacientes: Paciente[] = row.getValue(id);
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
      const pacientes: Paciente[] = row.getValue(id);
      const ranges = ageRanges.map((range) => JSON.parse(range) as NumberRange);
      return pacientes.some((paciente) => {
        if (!paciente.idade) {
          return false;
        }
        return ranges.some(({ min, max }) => {
          if (max === 12 && isBelowOneYear(paciente)) return true; //retorna os pacientes menores de 1 um ano quando seleciona o filtro menor de 13anos
          return paciente.idade! >= min && paciente.idade! <= max; //demais filtros
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
      const dateString: Date = row.getValue(id);
      const formatedDate = formatDate(dateString, "yyyy-MM-dd HH:mm:ss");
      const date = new Date(formatedDate);
      const weekDay = getDay(date).toString();
      return selectedWeekDays.includes(weekDay);
    },
  },
  {
    id: "filtro-hora",
    header: () => null,
    cell: () => null,
    accessorKey: "veiculos",
    filterFn: (row, id, selectedHours: string[]) => {
      const veiculos: Veiculo[] = row.getValue(id);
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
