import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Turn, useTurnStore } from "@/hooks/useTurnStore";

const turnos: Turn[] = [
  {
    from: "01:00:00",
    to: "01:00:00",
    numericFrom: 1,
    numericTo: 1,
  },
  {
    from: "7:00:00",
    to: "13:00:00",
    numericFrom: 7,
    numericTo: 13,
  },
  {
    from: "13:00:00",
    to: "19:00:00",
    numericFrom: 13,
    numericTo: 19,
  },
  {
    from: "19:00:00",
    to: "1:00:00",
    numericFrom: 19,
    numericTo: 1,
  },
  {
    from: "1:00:00",
    to: "7:00:00",
    numericFrom: 1,
    numericTo: 7,
  },
];

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
          <SelectLabel>Turnos</SelectLabel>
          <SelectItem value={JSON.stringify(turnos[0])}>Todos</SelectItem>
          <SelectItem value={JSON.stringify(turnos[4])}>1h - 7h</SelectItem>
          <SelectItem value={JSON.stringify(turnos[1])}>7h - 13h</SelectItem>
          <SelectItem value={JSON.stringify(turnos[2])}>13h - 19h</SelectItem>
          <SelectItem value={JSON.stringify(turnos[3])}>19h - 1h</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const vehicleTurns: Turn[] = [
  {
    from: "07:00:00",
    to: "07:00:00",
    numericFrom: 7,
    numericTo: 7,
  },
  {
    from: "7:00:00",
    to: "19:00:00",
    numericFrom: 7,
    numericTo: 19,
  },
  {
    from: "19:00:00",
    to: "07:00:00",
    numericFrom: 19,
    numericTo: 7,
  },
];

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
}
