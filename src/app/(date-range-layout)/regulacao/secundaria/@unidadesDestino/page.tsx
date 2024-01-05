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
import { useUnidadesDestino } from "./useUnidadesDestino";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export default function RegulacaoSecundariaUnidadesDestino() {
  const { getOcorrencias, isLoadingOcorrencias, unidades } =
    useUnidadesDestino();

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
            {!unidades ? (
              <SkeletonTable numberOfCols={3} numberOfRows={10} />
            ) : (
              unidades.map((destination) => (
                <TableRow
                  key={destination.nome}
                  role="button"
                  onClick={() => getOcorrencias(Number(destination.id))}
                >
                  <TableCell className="font-medium">
                    {destination.nome}
                  </TableCell>
                  <TableCell className="text-end">
                    {destination.tempo}
                  </TableCell>
                  <TableCell className="text-end">
                    {destination.totalOcorrencias}
                  </TableCell>
                </TableRow>
              ))
            )}
            {unidades && unidades.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-primary text-primary-foreground sticky bottom-0">
            <TableRow className="hover:bg-inherit">
              <TableCell className="font-bold">Média</TableCell>
              <TableCell className="text-end font-bold">
                {/* calcula a media dos tempos */}
                {(unidades &&
                  Math.ceil(
                    unidades.reduce(
                      (acc, destination) => acc + destination.tempo,
                      0,
                    ) / unidades.length,
                  )) ||
                  ""}
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
          className="text-primary fixed left-1/2 top-1/2 animate-spin"
        />
      )}
    </>
  );
}
