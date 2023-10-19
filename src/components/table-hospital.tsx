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
import { Button } from "./ui/button";
import { DialogDestinyIncidents } from "./dialogs/DialogDestinyIncidents";
import { useState } from "react";

export function TableHospital({ data }: { data: TempoHospitais }) {
  const [selectedDestiny, setSelectedDestiny] =
    useState<TempoHospitais["individual"][0]>();
  return (
    <>
      <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-100">
            <TableRow>
              <TableHead className="text-start ">Unidade de destino</TableHead>
              <TableHead className="text-end">Tempo resposta</TableHead>
              {/*    <TableHead className="text-end">Total ocorrencias</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.individual.map((hospital) => (
              <TableRow key={hospital.nome}>
                <TableCell>
                  <Button
                    variant="link"
                    className="h-min w-max p-0 font-bold underline"
                    onClick={() => setSelectedDestiny(hospital)}
                  >
                    {hospital.nome}
                  </Button>
                </TableCell>
                <TableCell className="text-end">{hospital.tempo}</TableCell>
                {/*   <TableCell className="text-end">
                  {hospital.totalOcorrencias}
                </TableCell> */}
              </TableRow>
            ))}
            {data.individual.length === 0 && (
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
                {data.media?.tempo}
              </TableCell>
              {/*   <TableCell></TableCell> */}
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
      {selectedDestiny && (
        <DialogDestinyIncidents
          destiny={selectedDestiny}
          open={selectedDestiny !== undefined}
          onClose={() => setSelectedDestiny(undefined)}
        />
      )}
    </>
  );
}
