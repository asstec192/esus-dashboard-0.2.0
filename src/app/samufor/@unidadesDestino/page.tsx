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
import { useUnidadesDestino } from "./useUnidadesDestino";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { RegulacaoSecundariaOcorrencias } from "../_components/ocorrencias";
import Link from "next/link";

export default function RegulacaoSecundariaUnidadesDestino() {
  const {
    unidades,
    ocorrenciasQuery,
    unidadeSelecionada,
    setUnidadeSelecionada,
  } = useUnidadesDestino();

  return (
    <div className="grid h-full grid-cols-5 gap-4">
      <ScrollArea className="col-span-full h-[calc(100vh-9rem)] rounded border lg:col-span-3">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-100 dark:bg-card">
            <TableRow>
              <TableHead className="text-start">Unidade de destino</TableHead>
              <TableHead className="text-end">Tempo resposta</TableHead>
              <TableHead className="text-end">N° de Ocorrências</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!unidades ? (
              <SkeletonTable numberOfCols={3} numberOfRows={10} />
            ) : (
              unidades.map((unidade) => (
                <Link key={unidade.id} href="#ocorrencias" legacyBehavior>
                  <TableRow
                    className="flex-grow-0"
                    key={unidade.nome}
                    role="button"
                    onClick={() => setUnidadeSelecionada(unidade)}
                  >
                    <TableCell className="font-medium">
                      {unidade.nome}
                    </TableCell>
                    <TableCell className="text-end">{unidade.tempo}</TableCell>
                    <TableCell className="text-end">
                      {unidade.totalOcorrencias}
                    </TableCell>
                  </TableRow>
                </Link>
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
          <TableFooter className="sticky bottom-0 bg-primary text-primary-foreground">
            <TableRow className="hover:bg-inherit">
              <TableCell />
              <TableCell className="text-end font-bold">
                {/* calcula a media dos tempos */}
                {(unidades &&
                  Math.ceil(
                    unidades.reduce((acc, unidade) => acc + unidade.tempo, 0) /
                      unidades.length,
                  )) ||
                  ""}{" "}
                (média)
              </TableCell>
              <TableCell className="text-end font-bold">
                {unidades?.reduce(
                  (acc, unidade) => acc + unidade.totalOcorrencias,
                  0,
                )}{" "}
                (total)
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <RegulacaoSecundariaOcorrencias
        description={unidadeSelecionada?.nome || ""}
        ocorrencias={ocorrenciasQuery.data || []}
        isLoading={ocorrenciasQuery.isLoading && !!unidadeSelecionada}
      />
    </div>
  );
}