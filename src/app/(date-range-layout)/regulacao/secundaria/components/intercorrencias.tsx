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
import { IntercorrenciaCount } from "@/server/api/routers/intercorrencias";
import { Loader2 } from "lucide-react";
import {
  DateRange,
  useGlogalDateFilterStore,
} from "@/hooks/useGlobalDateFilterStore";
import { useTurnStore } from "../stores";
import { useMutationOcorrenciasDaIntercorrencia } from "../hooks";
import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";

export function RegulacaoSecundariaIntercorrencias({
  data,
}: {
  data: IntercorrenciaCount[];
}) {
  const dateRange = useGlogalDateFilterStore(
    (state) => state.dateRange,
  ) as DateRange;
  const turn = useTurnStore((state) => state.turn);
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const { mutate, isLoading } = useMutationOcorrenciasDaIntercorrencia();
  return (
    <>
      <ScrollArea className="h-[calc(100vh-9rem)] rounded-md border">
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
              <TableRow
                key={intercorrencia.description}
                role="button"
                onClick={() =>
                  mutate(
                    {
                      dateRange,
                      turn,
                      intercorrenciaId: intercorrencia.id,
                    },
                    { onSuccess: setOcorrencias },
                  )
                }
              >
                <TableCell className="font-medium">
                  {intercorrencia.description}
                </TableCell>
                <TableCell className="text-end">
                  {intercorrencia.count}
                </TableCell>
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
          <TableFooter className="sticky bottom-0 bg-primary text-primary-foreground">
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

      {isLoading && (
        <Loader2
          size={30}
          className="fixed left-1/2 top-1/2 animate-spin text-primary"
        />
      )}
    </>
  );
}
