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
import { useState } from "react";
import { DialogVehicleIncidents } from "../dialogs/DialogVehicleIncidents";
import { Button } from "../ui/button";

export function TableVehicles({ data }: { data: TempoRespostaVeiculos[] }) {
  const [selectedVehicle, setSelectedVehicle] =
    useState<TempoRespostaVeiculos>();
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
              <TableHead className="text-end">N° de Ocorrências</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vehicle) => (
              <TableRow className="text-end" key={vehicle.id}>
                <TableCell className="text-start font-bold">
                  <Button
                    variant="link"
                    size="icon"
                    className="h-min w-max font-bold underline"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    {vehicle.nome}
                  </Button>
                </TableCell>
                <TableCell>{vehicle.QTYQUS}</TableCell>
                <TableCell>{vehicle.QUSQUY}</TableCell>
                <TableCell>{vehicle.QUYQUU}</TableCell>
                <TableCell>{vehicle.totalOcorrencias}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
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
              <TableCell>
                {Math.ceil(
                  data.reduce(
                    (acc, vehicle) => acc + (vehicle.QTYQUS || 0),
                    0,
                  ) / data.length,
                )}
              </TableCell>
              <TableCell>
                {Math.ceil(
                  data.reduce(
                    (acc, vehicle) => acc + (vehicle.QUSQUY || 0),
                    0,
                  ) / data.length,
                )}
              </TableCell>
              <TableCell>
                {Math.ceil(
                  data.reduce(
                    (acc, vehicle) => acc + (vehicle.QUYQUU || 0),
                    0,
                  ) / data.length,
                )}
              </TableCell>
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
