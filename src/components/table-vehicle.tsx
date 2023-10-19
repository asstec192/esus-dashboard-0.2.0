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
import { useState } from "react";
import { DialogVehicleIncidents } from "./dialogs/DialogVehicleIncidents";
import { Button } from "./ui/button";

export function TableVehicle({ data }: { data: TempoVeiculos }) {
  const [selectedVehicle, setSelectedVehicle] =
    useState<TempoVeiculos["individual"][0]>();
  return (
    <>
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
              <TableHead className="text-end">
                Total de ocorrências atendidas
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.individual.map((veiculo) => (
              <TableRow className="text-end" key={veiculo.id}>
                <TableCell className="text-start font-bold">
                  <Button
                    variant="link"
                    size="icon"
                    className="h-min w-max font-bold underline"
                    onClick={() => setSelectedVehicle(veiculo)}
                  >
                    {veiculo.nome}
                  </Button>
                </TableCell>
                <TableCell>{veiculo.QTYQUS}</TableCell>
                <TableCell>{veiculo.QUSQUY}</TableCell>
                <TableCell>{veiculo.QUYQUU}</TableCell>
                <TableCell>{veiculo.contagemOcorrencias}</TableCell>
              </TableRow>
            ))}
            {data.individual.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
      {selectedVehicle && (
        <DialogVehicleIncidents
          vehicle={selectedVehicle}
          open={selectedVehicle !== undefined}
          onClose={() => setSelectedVehicle(undefined)}
        />
      )}
    </>
  );
}
