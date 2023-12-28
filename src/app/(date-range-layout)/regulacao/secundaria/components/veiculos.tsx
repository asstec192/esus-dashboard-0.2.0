import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RouterOutputs } from "@/trpc/shared";
import { useMutationOcorrenciasDoVeiculo } from "../hooks";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { useTurnStore } from "../stores";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";

export function RegulacaoSecundariaVeiculos({
  data,
}: {
  data: RouterOutputs["vehicles"]["getReport"];
}) {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useTurnStore((state) => state.turn);
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const { mutate, isLoading } = useMutationOcorrenciasDoVeiculo();
  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-9rem)]">
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
              <TableHead className="text-end">N° de Ocorrências</TableHead>
              <TableHead className="text-end">N° de Pacientes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                onClick={() =>
                  mutate(
                    { dateRange, turn, vehicleId: vehicle.id },
                    { onSuccess: setOcorrencias },
                  )
                }
                className="text-right"
                role="button"
              >
                <TableCell className="text-start font-medium">
                  {vehicle.nome}
                </TableCell>
                <TableCell>{vehicle.QTYQUS}</TableCell>
                <TableCell>{vehicle.QUSQUY}</TableCell>
                <TableCell>{vehicle.QUYQUU}</TableCell>
                <TableCell>{vehicle.totalOcorrencias}</TableCell>
                <TableCell>{vehicle.pacientes.length}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="sticky bottom-0 bg-primary text-primary-foreground">
            <TableRow className="text-end font-bold hover:bg-inherit">
              <TableCell className="text-start">Média</TableCell>
              <TableCell>
                {Math.ceil(
                  data.reduce(
                    (acc, vehicle) => acc + (vehicle.QTYQUS || 0),
                    0,
                  ) / data.length,
                ) || ""}
              </TableCell>
              <TableCell>
                {Math.ceil(
                  data.reduce(
                    (acc, vehicle) => acc + (vehicle.QUSQUY || 0),
                    0,
                  ) / data.length,
                ) || ""}
              </TableCell>
              <TableCell>
                {Math.ceil(
                  data.reduce(
                    (acc, vehicle) => acc + (vehicle.QUYQUU || 0),
                    0,
                  ) / data.length,
                ) || ""}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {isLoading && (
        <Loader2
          size={30}
          className="fixed left-1/2 top-1/2 animate-spin text-primary"
        />
      )}
    </Card>
  );
}
