import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { addHours } from "date-fns";
import { formatProperName } from "@/utils/formatProperName";
import { getColorByRisk } from "@/utils/getColorByRisk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/shared";
import Link from "next/link";

export function RegulacaoSecundariaOcorrencias({
  ocorrencias,
  description,
}: {
  ocorrencias: RouterOutputs["vehicles"]["getIncidents"];
  description: string;
}) {
  return (
    <Card
      id="ocorrencias"
      className="col-span-full flex h-[calc(100vh-9rem)] flex-col lg:col-span-2"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold">Ocorrências</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <ScrollArea className="relative flex-grow border-t-[1px]">
        <CardContent className="relative  px-0">
          <Table>
            <TableBody>
              {ocorrencias.map((ocorrencia) => (
                <Link
                  key={ocorrencia.OcorrenciaID.toString()}
                  href={{
                    query: { ocorrenciaId: ocorrencia.OcorrenciaID.toString() },
                  }}
                  legacyBehavior
                >
                  <TableRow role="button">
                    <TableCell className="flex flex-col items-start gap-2 align-top">
                      <span
                        className="font-medium"
                        style={{ color: getColorByRisk(ocorrencia.RISCOCOD) }}
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
                      {addHours(ocorrencia.DtHr!, 3).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </Link>
              ))}

              {ocorrencias.length === 0 && (
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
