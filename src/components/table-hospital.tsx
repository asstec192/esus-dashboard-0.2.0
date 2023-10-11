import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type TempoHospitais } from "@/lib/tempo-hospitais";

export function TableHospital({ data }: { data: TempoHospitais }) {
  return (
    <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 bg-slate-100">
          <TableRow>
            <TableHead className="text-start">Unidade de destino</TableHead>
            <TableHead className="text-end">Tempo resposta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.individual.map((hospital) => (
            <TableRow key={hospital.nome}>
              <TableCell className="font-bold">{hospital.nome}</TableCell>
              <TableCell className="text-end">{hospital.tempo}</TableCell>
            </TableRow>
          ))}
          {data.individual.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum resultado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="sticky bottom-0">
          <TableRow className="hover:bg-inherit">
            <TableCell className="font-bold">Média</TableCell>
            <TableCell className="text-end font-bold">
              {data.media?.tempo}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ScrollArea>
  );
}
