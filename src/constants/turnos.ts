import { z } from "zod";
import { turnoSchema } from "./zod-schemas";

export type Turno = z.infer<typeof turnoSchema>;

export const turnos: Turno[] = [
  {
    from: 1,
    to: 1,
    label: "1h-1h",
    category: "tarm"
  },
  {
    from: 1,
    to: 7,
    label: "T0 (1h-7h)",
    category: "tarm"
  },
  {
    from: 7,
    to: 13,
    label: "T1 (7h-13h)",
    category: "tarm"
  },
  {
    from: 13,
    to: 19,
    label: "T2 (13h-19h)",
    category: "tarm"
  },
  {
    from: 19,
    to: 1,
    label: "T3 (19h-1h)",
    category: "tarm"
  },
];

export const turnosVeiculos: Turno[] = [
  {
    from: 7,
    to: 7,
    label: "7h-7h",
    category: "veiculo"
  },
  {
    from: 7,
    to: 19,
    label: "7h-19h",
    category: "veiculo"
  },
  {
    from: 19,
    to: 7,
    label: "19h-7h",
    category: "veiculo"
  },
];
