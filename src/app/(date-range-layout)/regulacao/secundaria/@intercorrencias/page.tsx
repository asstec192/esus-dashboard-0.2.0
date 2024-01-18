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

import { useIntercorrencias } from "./useIntercorrencias";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { RegulacaoSecundariaOcorrencias } from "../components/ocorrencias";
import Link from "next/link";

export default function RegulacaoSecundariaIntercorrencias() {
  const {
    intercorrencias,
    ocorrenciasQuery,
    intercorrenciaSelecionada,
    setIntercorrenciaSelecionada,
  } = useIntercorrencias();

  return (
    <div className="grid h-full grid-cols-5 gap-4">
      <ScrollArea className="col-span-full h-[calc(100vh-9rem)] rounded border lg:col-span-3">
        <ScrollBar orientation="horizontal" />
        <Table className="min-h-[calc(100vh-9.1rem)]">
          <TableHeader className="sticky top-0 bg-slate-100 dark:bg-card">
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
                <Link
                  key={intercorrencia.id}
                  href="#ocorrencias"
                  legacyBehavior
                >
                  <TableRow
                    key={intercorrencia.description}
                    role="button"
                    onClick={() => setIntercorrenciaSelecionada(intercorrencia)}
                  >
                    <TableCell className="font-medium">
                      {intercorrencia.description}
                    </TableCell>
                    <TableCell className="text-end">
                      {intercorrencia.count}
                    </TableCell>
                  </TableRow>
                </Link>
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
          <TableFooter className="sticky bottom-0 bg-primary text-primary-foreground">
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
      <RegulacaoSecundariaOcorrencias
        description={intercorrenciaSelecionada?.description || ""}
        ocorrencias={ocorrenciasQuery.data || []}
        isLoading={ocorrenciasQuery.isLoading && !!intercorrenciaSelecionada}
      />
    </div>
  );
}
