import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatProperName } from "@/utils/formatProperName";
import { RouterOutputs } from "@/trpc/shared";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatClientDateToLocaleString } from "@/utils/formatClientDateToLocaleString";

export function RegulacaoSecundariaOcorrencias({
  ocorrencias,
  description,
  isLoading,
}: {
  ocorrencias: RouterOutputs["destinos"]["getOcorrencias"];
  description: string;
  isLoading: boolean;
}) {
  return (
    <Card
      id="ocorrencias"
      className="col-span-full flex h-[calc(100vh-9rem)] flex-col lg:col-span-2"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">Ocorrências</CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="h-4 w-40" /> : description}
        </CardDescription>
      </CardHeader>
      <ScrollArea className="relative flex-grow border-t-[1px]">
        <CardContent className="relative  px-0">
          <Table>
            <TableBody>
              {ocorrencias.map((ocorrencia) => (
                <Link
                  key={ocorrencia.OcorrenciaID.toString()}
                  href={{
                    query: {
                      ocorrenciaId: ocorrencia.OcorrenciaID.toString(),
                    },
                  }}
                  legacyBehavior
                >
                  <TableRow role="button">
                    <TableCell className="flex flex-col items-start gap-2 align-top">
                      <span
                        className={`${ocorrencia.riscoColorClass.text} font-medium`}
                      >
                        {ocorrencia.OcorrenciaID.toString()}
                      </span>
                      <span className="text-xs">
                        {ocorrencia.Motivo?.MotivoDS || "NÃO PREENCHIDO"}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      {formatProperName(ocorrencia.Bairro)}
                    </TableCell>
                    <TableCell colSpan={2} className="text-end align-top">
                      {formatClientDateToLocaleString(ocorrencia.DtHr)}
                    </TableCell>
                  </TableRow>
                </Link>
              ))}

              {isLoading && (
                <SkeletonTable numberOfRows={20} numberOfCols={3} />
              )}

              {ocorrencias.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell className="h-24 text-center">
                    Nenhum resultado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
