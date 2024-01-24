"use client";

import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../../../../../components/ui/separator";
import { useRegulacaoSecundariaStore } from "../stores";
import { turnoSchema } from "@/constants/zod-schemas";

export type Turno = z.infer<typeof turnoSchema>;

export const turnos: Turno[] = [
  {
    from: 1,
    to: 1,
    label: "1h-1h",
    category: "tarm",
  },
  {
    from: 1,
    to: 7,
    label: "T0 (1h-7h)",
    category: "tarm",
  },
  {
    from: 7,
    to: 13,
    label: "T1 (7h-13h)",
    category: "tarm",
  },
  {
    from: 13,
    to: 19,
    label: "T2 (13h-19h)",
    category: "tarm",
  },
  {
    from: 19,
    to: 1,
    label: "T3 (19h-1h)",
    category: "tarm",
  },
];

export const turnosVeiculos: Turno[] = [
  {
    from: 7,
    to: 7,
    label: "7h-7h",
    category: "veiculo",
  },
  {
    from: 7,
    to: 19,
    label: "7h-19h",
    category: "veiculo",
  },
  {
    from: 19,
    to: 7,
    label: "19h-7h",
    category: "veiculo",
  },
];

export function RegulacaoSecundariaSelectTurno() {
  const turn = useRegulacaoSecundariaStore((state) => state.turn);
  const setTurn = useRegulacaoSecundariaStore((state) => state.setTurn);
  return (
    <Select
      defaultValue={JSON.stringify(turn)}
      onValueChange={(value) => setTurn(JSON.parse(value))}
    >
      <SelectTrigger className="w-[200px] p-1">
        <SelectValue placeholder="Selecione um turno" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Turnos da regulação</SelectLabel>
          {turnos.map((turno) => (
            <SelectItem key={turno.label} value={JSON.stringify(turno)}>
              {turno.label}
            </SelectItem>
          ))}
          <Separator />
          <SelectLabel>Turnos dos veículos</SelectLabel>
          {turnosVeiculos.map((turno) => (
            <SelectItem key={turno.from} value={JSON.stringify(turno)}>
              {turno.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
