import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTurnStore } from "@/hooks/useTurnStore";
import { Separator } from "../ui/separator";
import { turnos, turnosVeiculos } from "@/utils/turnos";

export function TurnSelect() {
  const turn = useTurnStore((state) => state.turn);
  const setTurn = useTurnStore((state) => state.setTurn);
  return (
    <Select
      defaultValue={JSON.stringify(turn)}
      onValueChange={(value) => setTurn(JSON.parse(value))}
    >
      <SelectTrigger className="w-full p-1 sm:w-[100px]">
        <SelectValue placeholder="Selecione um turno" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Turnos da regulação</SelectLabel>
          {turnos.map((turno) => (
            <SelectItem value={JSON.stringify(turno)}>{turno.label}</SelectItem>
          ))}
          <Separator />
          <SelectLabel>Turnos dos veículos</SelectLabel>
          {turnosVeiculos.map((turno) => (
            <SelectItem value={JSON.stringify(turno)}>{turno.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/* const vehicleTurns: Turn[] = [];

export function SelectVehicleTurn() {
  const turn = useTurnStore((state) => state.vehicleTurn);
  const setTurn = useTurnStore((state) => state.setVehicleTurn);
  return (
    <Select
      defaultValue={JSON.stringify(turn)}
      onValueChange={(value) => setTurn(JSON.parse(value))}
    >
      <SelectTrigger className="w-full p-1 sm:w-[100px]">
        <SelectValue placeholder="Selecione um turno" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Turnos</SelectLabel>
          <SelectItem value={JSON.stringify(vehicleTurns[0])}>Todos</SelectItem>
          <SelectItem value={JSON.stringify(vehicleTurns[1])}>
            7h - 19h
          </SelectItem>
          <SelectItem value={JSON.stringify(vehicleTurns[2])}>
            19h - 7h
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
} */
