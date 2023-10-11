import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Turn } from "@/hooks/useGlobalDateFilterStore";

const turnos: Turn[] = [
  {
    from: "",
    to: "",
  },
  {
    from: "7:00:00",
    to: "13:00:00",
  },
  {
    from: "13:00:00",
    to: "19:00:00",
  },
  {
    from: "19:00:00",
    to: "1:00:00",
  },
  {
    from: "1:00:00",
    to: "7:00:00",
  },
];

type TurnSelectProps = {
  onValueChange: (value: string) => void;
};

export function TurnSelect({ onValueChange }: TurnSelectProps) {
  return (
    <Select
      defaultValue={JSON.stringify(turnos[0])}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Selecione um turno" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Turnos</SelectLabel>
          <SelectItem value={JSON.stringify(turnos[0])}>Todos</SelectItem>
          <SelectItem value={JSON.stringify(turnos[1])}>Turno 1</SelectItem>
          <SelectItem value={JSON.stringify(turnos[2])}>Turno 2</SelectItem>
          <SelectItem value={JSON.stringify(turnos[3])}>Turno 3</SelectItem>
          <SelectItem value={JSON.stringify(turnos[4])}>Turno 4</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
