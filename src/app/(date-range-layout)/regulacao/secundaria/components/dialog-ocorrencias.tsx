"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useMutationGetOcorrencia } from "@/hooks/useMutationGetOcorrencia";
import { useTurnStore } from "../stores";
import { addHours } from "date-fns";
import { isWithinHour } from "@/utils/isWithinTurn";
import { formatProperName } from "@/utils/formatProperName";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { useOcorrenciaStore } from "@/hooks/useOcorrenciaStore";
import { Loader2 } from "lucide-react";

export const RegulacaoSecundariaOcorrencias = () => {
  const turn = useTurnStore((state) => state.turn);
  const ocorrencias = useOcorrenciaStore((state) => state.ocorrencias);
  const setOcorrencias = useOcorrenciaStore((state) => state.setOcorrencias);
  const { mutate, isLoading } = useMutationGetOcorrencia();

  return (
    <Dialog open={!!ocorrencias} onOpenChange={() => setOcorrencias(undefined)}>
      <DialogContent className="max-w-7xl">
        <ScrollArea className="relative max-h-screen rounded-md border sm:max-h-[70vh]">
          <ScrollBar orientation="horizontal" />
          <Table>
            <TableHeader className="sticky top-0 bg-slate-100">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Loader2
                      size={30}
                      className="text-primary mx-auto animate-spin"
                    />
                  </TableCell>
                </TableRow>
              ) : null}
              {ocorrencias
                ?.filter((incident) =>
                  isWithinHour(
                    addHours(incident.DtHr!, 3),
                    turn.numericFrom,
                    turn.numericTo,
                  ),
                )
                .map((incident) => (
                  <TableRow key={incident.OcorrenciaID.toString()}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-min p-0 underline"
                        style={{ color: getColorByRisk(incident.RISCOCOD) }}
                        onClick={() =>
                          mutate({
                            incidentId: Number(incident.OcorrenciaID),
                          })
                        }
                      >
                        {incident.OcorrenciaID.toString()}
                      </Button>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {incident.Motivo?.MotivoDS || "NÃO PREENCHIDO"}
                    </TableCell>
                    <TableCell>{formatProperName(incident.Bairro)}</TableCell>
                    <TableCell colSpan={2}>
                      {addHours(incident.DtHr!, 3).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
