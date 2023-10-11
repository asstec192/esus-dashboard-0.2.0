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
import { type TempoVeiculos } from "@/lib/tempo-veiculos";

export function TableVehicle({ data }: { data: TempoVeiculos }) {
  return (
    <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 bg-slate-100">
          <TableRow>
            <TableHead>Veículo</TableHead>
            <TableHead className="text-end">
              Chegada ao local - QTY QUS (min)
            </TableHead>
            <TableHead className="text-end">
              Atendimento no local - QUS QUY (min)
            </TableHead>
            <TableHead className="text-end">
              Chegada ao destino - QUY QUU (min)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.individual.map((veiculo) => (
            <TableRow key={veiculo.nome} className="text-end">
              <TableCell className="text-start font-bold">
                {veiculo.nome}
              </TableCell>
              <TableCell>{veiculo.QTYQUS}</TableCell>
              <TableCell>{veiculo.QUSQUY}</TableCell>
              <TableCell>{veiculo.QUYQUU}</TableCell>
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
          <TableRow className="text-end font-bold hover:bg-inherit">
            <TableCell className="text-start">Média</TableCell>
            <TableCell>{data.media?.QTYQUS}</TableCell>
            <TableCell>{data.media?.QUSQUY}</TableCell>
            <TableCell>{data.media?.QUYQUU}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ScrollArea>
  );
}
