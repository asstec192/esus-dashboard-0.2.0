import { Turn } from "@/hooks/useTurnStore";

export const turnos: Turn[] = [
  {
    from: "01:00:00",
    to: "01:00:00",
    numericFrom: 1,
    numericTo: 1,
    label: "1h-1h",
  },
  {
    from: "1:00:00",
    to: "7:00:00",
    numericFrom: 1,
    numericTo: 7,
    label: "T0 (1h-7h)",
  },
  {
    from: "7:00:00",
    to: "13:00:00",
    numericFrom: 7,
    numericTo: 13,
    label: "T1 (7h-13h)",
  },
  {
    from: "13:00:00",
    to: "19:00:00",
    numericFrom: 13,
    numericTo: 19,
    label: "T2 (13h-19h)",
  },
  {
    from: "19:00:00",
    to: "1:00:00",
    numericFrom: 19,
    numericTo: 1,
    label: "T3 (19h-1h)",
  },
];

export const turnosVeiculos: Turn[] = [
  {
    from: "07:00:00",
    to: "07:00:00",
    numericFrom: 7,
    numericTo: 7,
    label: "7h-7h",
  },
  {
    from: "7:00:00",
    to: "19:00:00",
    numericFrom: 7,
    numericTo: 19,
    label: "7h-19h",
  },
  {
    from: "19:00:00",
    to: "07:00:00",
    numericFrom: 19,
    numericTo: 7,
    label: "19h-7h",
  },
];
