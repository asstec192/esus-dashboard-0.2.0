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
    from: "1:00:00",
    to: "1:00:00",
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

type TurnSelectProps = {
  onValueChange: (value: string) => void;
};

export function TurnSelect({ onValueChange }: TurnSelectProps) {
  return (
    <Select
      defaultValue={JSON.stringify(turnos[0])}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[100px] p-1">
        <SelectValue placeholder="Selecione um turno" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Turnos</SelectLabel>
          <SelectItem value={JSON.stringify(turnos[0])}>Todos</SelectItem>
          <SelectItem value={JSON.stringify(turnos[1])}>7h - 13h</SelectItem>
          <SelectItem value={JSON.stringify(turnos[2])}>13h - 19h</SelectItem>
          <SelectItem value={JSON.stringify(turnos[3])}>19h - 1h</SelectItem>
          <SelectItem value={JSON.stringify(turnos[4])}>1h - 7h</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
