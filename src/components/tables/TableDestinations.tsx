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
import { Button } from "../ui/button";
import { DialogDestinationIncidents } from "../dialogs/DialogDestinationIncidents";
import { useState } from "react";

export function TableDestinations({ data }: { data: TempoRespostaDestino[] }) {
  const [selectedDestiny, setSelectedDestiny] =
    useState<TempoRespostaDestino>();
  return (
    <>
      <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-100">
            <TableRow>
              <TableHead className="text-start ">Unidade de destino</TableHead>
              <TableHead className="text-end">Tempo resposta</TableHead>
              <TableHead className="text-end">N° de Ocorrências</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((destination) => (
              <TableRow key={destination.nome}>
                <TableCell>
                  <Button
                    variant="link"
                    className="h-min w-max p-0 font-bold underline"
                    onClick={() => setSelectedDestiny(destination)}
                  >
                    {destination.nome}
                  </Button>
                </TableCell>
                <TableCell className="text-end">{destination.tempo}</TableCell>
                <TableCell className="text-end">
                  {destination.totalOcorrencias}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="sticky bottom-0">
            <TableRow className="hover:bg-inherit">
              <TableCell className="font-bold">Média</TableCell>
              <TableCell className="text-end font-bold">
                {/* calcula a media dos tempos */}
                {Math.ceil(
                  data.reduce(
                    (acc, destination) => acc + destination.tempo,
                    0,
                  ) / data.length,
                )}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
      {selectedDestiny && (
        <DialogDestinationIncidents
          destiny={selectedDestiny}
          open={selectedDestiny !== undefined}
          onClose={() => setSelectedDestiny(undefined)}
        />
      )}
    </>
  );
}
