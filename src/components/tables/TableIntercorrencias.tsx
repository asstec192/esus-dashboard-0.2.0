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
import { useState } from "react";
import { DialogIntercorrenciaIncidents } from "../dialogs/DialogIntercorrenciaIncidents";
import { IntercorrenciaCount } from "@/server/api/routers/intercorrencias";

export function TableIntercorrencias({
  data,
}: {
  data: IntercorrenciaCount[];
}) {
  const [selectedIntercorrencia, setSelectedIntercorrencia] =
    useState<IntercorrenciaCount>();

  return (
    <>
      <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-100">
            <TableRow>
              <TableHead>Intercorrência</TableHead>
              <TableHead className="text-end">N° de Ocorrências</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((intercorrencia) => (
              <TableRow className="text-end" key={intercorrencia.description}>
                <TableCell className="text-start font-bold">
                  <Button
                    variant="link"
                    size="icon"
                    className="h-min w-max font-bold underline"
                    onClick={() => setSelectedIntercorrencia(intercorrencia)}
                  >
                    {intercorrencia.description}
                  </Button>
                </TableCell>
                <TableCell>{intercorrencia.count}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="sticky bottom-0">
            <TableRow className="text-end font-bold hover:bg-inherit">
              <TableCell className="text-start">Total</TableCell>
              <TableCell>
                {data.reduce((acc, intercorrencia) => {
                  return acc + intercorrencia.count;
                }, 0) || ""}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
      {selectedIntercorrencia && (
        <DialogIntercorrenciaIncidents
          intercorrencia={selectedIntercorrencia}
          open={selectedIntercorrencia !== undefined}
          onClose={() => setSelectedIntercorrencia(undefined)}
        />
      )}
    </>
  );
}
