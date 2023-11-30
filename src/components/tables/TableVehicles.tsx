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
import { useState } from "react";
import { Button } from "../ui/button";
import { useVehicleIncidentsQuery } from "@/hooks/useVehicleIncidentsQuery";
import { Loader2 } from "lucide-react";
import { DialogIncidentsList } from "../dialogs/DialogIncidentsList";
import { useTurnStore } from "@/hooks/useTurnStore";
import { RouterOutputs } from "@/utils/api";

export function TableVehicles({
  data,
}: {
  data: RouterOutputs["vehicles"]["getReport"];
}) {
  const turn = useTurnStore((state) => state.turn);
  const [selectedVehicleId, setSelectedVehicleId] = useState(0);
  const {
    isFetching,
    data: incidents,
    isError,
  } = useVehicleIncidentsQuery(selectedVehicleId);
  return (
    <>
      <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
        <ScrollBar orientation="horizontal" />
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
              <TableRow className="text-end" key={vehicle.id}>
                <TableCell className="text-start font-bold">
                  <Button
                    variant="link"
                    size="icon"
                    className="h-min w-max font-bold underline"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                  >
                    {vehicle.nome}
                  </Button>
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
          <TableFooter className="sticky bottom-0">
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
      </ScrollArea>
      {isFetching ? (
        <Loader2
          size={30}
          className="fixed left-1/2 top-1/2 animate-spin text-primary"
        />
      ) : (
        <DialogIncidentsList
          data={incidents || []}
          open={selectedVehicleId !== 0 && !isError}
          onClose={() => setSelectedVehicleId(0)}
          turn={turn}
        />
      )}
    </>
  );
}
