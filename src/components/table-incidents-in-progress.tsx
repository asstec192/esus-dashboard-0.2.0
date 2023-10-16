import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { formatProperName } from "@/utils/formatProperName";
import { PopoverVeiculo } from "@/components/popover-veiculo";
import { ProtectedDialogIncident } from "@/components/dialog-incident";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { TypographyH3 } from "@/components/typography/TypographyH3";
import { cn } from "@/lib/utils";
import { type HtmlHTMLAttributes } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIncidentStore } from "@/hooks/useIncidentStore";
import { useRealTimeIncidentQuery } from "@/hooks/useRealTimeIncidents";

export const IncidentsInProgress = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  const setModalIncident = useIncidentStore((state) => state.setModalIncident);
  const { data, isError, isLoading } = useRealTimeIncidentQuery();

  return (
    <Card
      className={cn(
        "flex flex-col space-y-2 border-0 shadow-none lg:border lg:p-6 lg:shadow-sm",
        className,
      )}
      {...props}
    >
      <TypographyH3>Ocorrências em Andamento</TypographyH3>

      {isError || isLoading ? (
        <SkeletonTable className="h-full flex-grow" />
      ) : (
        <Card className="w-full">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Médico Regulador</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Veículos Enviados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((ocorrencia) => (
                  <TableRow key={ocorrencia.id}>
                    <TableCell
                      role="button"
                      className="cursor-pointer font-medium underline"
                      style={{ color: getColorByRisk(ocorrencia.risco) }}
                      onClick={() => setModalIncident(ocorrencia)}
                    >
                      {ocorrencia.id}
                    </TableCell>
                    <TableCell className="font-bold">
                      {ocorrencia.motivo}
                    </TableCell>
                    <TableCell>
                      {formatProperName(ocorrencia.operador)}
                    </TableCell>
                    <TableCell>{formatProperName(ocorrencia.bairro)}</TableCell>
                    <TableCell className="flex flex-wrap gap-2">
                      {ocorrencia.veiculos.map((veiculo) => (
                        <PopoverVeiculo key={veiculo.nome} veiculo={veiculo} />
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum resultado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      )}

      <ProtectedDialogIncident />
    </Card>
  );
};
