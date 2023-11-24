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
import { Button } from "../ui/button";
import { useState } from "react";
import { IntercorrenciaCount } from "@/server/api/routers/intercorrencias";
import { useTurnStore } from "@/hooks/useTurnStore";
import { useIntercorrenciaIncidentsQuery } from "@/hooks/useIntercorrenciaIncidentsQuery";
import { Loader2 } from "lucide-react";
import { DialogIncidentsList } from "../dialogs/DialogIncidentsList";

export function TableIntercorrencias({
  data,
}: {
  data: IntercorrenciaCount[];
}) {
  const turn = useTurnStore(state=> state.turn)
  const [selectedIntercorrenciaId, setSelectedIntercorrenciaId] =
    useState(0);
  const {data: incidents, isFetching, isError} = useIntercorrenciaIncidentsQuery(selectedIntercorrenciaId)
  return (
    <>
      <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
        <ScrollBar orientation="horizontal" />
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
                    onClick={() => setSelectedIntercorrenciaId(intercorrencia.id)}
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
      {isFetching ? (
        <Loader2
          size={30}
          className="fixed left-1/2 top-1/2 animate-spin text-primary"
        />
      ) : (
        <DialogIncidentsList
          data={incidents || []}
          open={selectedIntercorrenciaId !== 0 && !isError}
          onClose={() => setSelectedIntercorrenciaId(0)}
          turn={turn}
        />
      )}
    </>
  );
}
