"use client";

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
import { turnos, turnosVeiculos } from "@/constants/turnos";
import { useTurnStore } from "../stores";

export function RegulacaoSecundariaSelectTurno() {
  const turn = useTurnStore((state) => state.turn);
  const setTurn = useTurnStore((state) => state.setTurn);
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
