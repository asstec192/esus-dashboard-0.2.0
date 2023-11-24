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
import { useDestinationIncidentsQuery } from "@/hooks/useDestinationIncidentsQuery";
import { DialogIncidentsList } from "../dialogs/DialogIncidentsList";
import { useTurnStore } from "@/hooks/useTurnStore";
import { Loader2 } from "lucide-react";

export function TableDestinations({ data }: { data: TempoRespostaDestino[] }) {
  const [selectedDestinyId, setSelectedDestinyId] = useState(0);
  const {
    data: incidents,
    isFetching,
    isError,
  } = useDestinationIncidentsQuery(selectedDestinyId);
  const turn = useTurnStore((state) => state.turn);
  return (
    <>
      <ScrollArea className="relative h-full rounded-lg border bg-card shadow-sm">
        <ScrollBar orientation="horizontal" />
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
                    onClick={() => setSelectedDestinyId(Number(destination.id))}
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
                ) || ""}
              </TableCell>
              <TableCell></TableCell>
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
          open={selectedDestinyId !== 0 && !isError}
          onClose={() => setSelectedDestinyId(0)}
          turn={turn}
        />
      )}
    </>
  );
}
