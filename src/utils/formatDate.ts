import { parseISO, format } from "date-fns";

export function formatDate(date: Date, _format: string) {
  // Remove o 'T' e o 'Z' da string da data pois o javascript interpretaria como UTC, quando na verdade a data ja esta no fuso horario de Sao Paulo
  const formattedDate = date.toISOString().replace("T", " ").replace("Z", "");
  const parsedDate = parseISO(formattedDate);
  const formattedOutput = format(parsedDate, _format);
  return formattedOutput;
}
