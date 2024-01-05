"use client";

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
import { useIntercorrencias } from "./useIntercorrencias";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export default function RegulacaoSecundariaIntercorrencias() {
  const { getOcorrencias, intercorrencias, isLoadingOcorrencias } =
    useIntercorrencias();

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
            {!intercorrencias ? (
              <SkeletonTable numberOfCols={2} numberOfRows={10} />
            ) : (
              intercorrencias.map((intercorrencia) => (
                <TableRow
                  key={intercorrencia.description}
                  role="button"
                  onClick={() => getOcorrencias(intercorrencia.id)}
                >
                  <TableCell className="font-medium">
                    {intercorrencia.description}
                  </TableCell>
                  <TableCell className="text-end">
                    {intercorrencia.count}
                  </TableCell>
                </TableRow>
              ))
            )}
            {intercorrencias && intercorrencias.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-primary text-primary-foreground sticky bottom-0">
            <TableRow className="text-end font-bold hover:bg-inherit">
              <TableCell className="text-start">Total</TableCell>
              <TableCell>
                {(intercorrencias &&
                  intercorrencias.reduce((acc, intercorrencia) => {
                    return acc + intercorrencia.count;
                  }, 0)) ||
                  ""}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>

      {isLoadingOcorrencias && (
        <Loader2
          size={30}
          className="text-primary fixed left-1/2 top-1/2 animate-spin"
        />
      )}
    </>
  );
}
