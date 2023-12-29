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
import { Loader2 } from "lucide-react";
import { useMutationOcorrenciasDaUnidadeDestino } from "../hooks";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { useTurnStore } from "../stores";
import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";

export function RegulacaoSecundariaUnidadesDestino({
  data,
  isLoading
}: {
  data: TempoRespostaDestino[];
  isLoading?: boolean
}) {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useTurnStore((state) => state.turn);
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const { mutate, isLoading: isLoadingOcorrencias } = useMutationOcorrenciasDaUnidadeDestino();
  return (
    <>
      <ScrollArea className="h-[calc(100vh-9rem)] rounded-md border">
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
              <TableRow
                key={destination.nome}
                role="button"
                onClick={() =>
                  mutate(
                    {
                      dateRange,
                      turn,
                      destinationId: Number(destination.id),
                    },
                    { onSuccess: setOcorrencias },
                  )
                }
              >
                <TableCell className="font-medium">
                  {destination.nome}
                </TableCell>
                <TableCell className="text-end">{destination.tempo}</TableCell>
                <TableCell className="text-end">
                  {destination.totalOcorrencias}
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
           {isLoading &&  <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                <Loader2
          size={30}
          className="animate-spin text-primary mx-auto"
        />
                </TableCell>
              </TableRow>}
          </TableBody>
          <TableFooter className="sticky bottom-0 bg-primary text-primary-foreground">
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {isLoadingOcorrencias && (
        <Loader2
          size={30}
          className="fixed left-1/2 top-1/2 animate-spin text-primary"
        />
      )}
    </>
  );
}
