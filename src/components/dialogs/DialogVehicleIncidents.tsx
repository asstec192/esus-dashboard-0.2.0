import { api } from "@/utils/api";
import { SimpleDialog } from "./SimpleDialog";
import { useGlogalDateFilterStore } from "@/hooks/useGlobalDateFilterStore";
import { toast } from "../ui/use-toast";
import { useState } from "react";
import { addHours } from "date-fns";
import { isWithinHourInterval } from "@/utils/isWithinHourInterval";
import { formatProperName } from "@/utils/formatProperName";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TempoVeiculos } from "@/lib/tempo-veiculos";
import { Button } from "../ui/button";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { Loader2 } from "lucide-react";
import { DialogIncident } from "./DialogIncident";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const DialogVehicleIncidents = ({
  vehicle,
  open,
  onClose,
}: {
  vehicle: TempoVeiculos["individual"][0];
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>();
  const dateRange = useGlogalDateFilterStore((state) => state.dateRange);
  const turn = useGlogalDateFilterStore((state) => state.turn);
  const { data, isLoading } = api.vehicle.getIncidents.useQuery(
    {
      vehicleId: vehicle.id,
      from: dateRange.from!,
      to: dateRange.to!,
    },
    {
      onError: (error) => {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );
  return (
    <>
      <SimpleDialog
        open={open}
        onOpenChange={onClose}
        title={`Ocorrências atendidas por ${vehicle.nome}`}
        className="max-w-7xl"
      >
        <ScrollArea className="relative max-h-[70vh] rounded-lg border bg-card shadow-sm">
          <ScrollBar orientation="horizontal" />
          <Table>
            <TableHeader className="sticky top-0 bg-slate-100">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Envio do primeiro veículo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                ?.filter((incident) =>
                  isWithinHourInterval(
                    addHours(
                      incident.OcorrenciaMovimentacao[0]?.EnvioEquipeDT!,
                      3,
                    ),
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
                          setSelectedIncidentId(Number(incident.OcorrenciaID))
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
                      {addHours(
                        incident.OcorrenciaMovimentacao[0]?.EnvioEquipeDT!,
                        3,
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Loader2 className="mx-auto my-0 animate-spin text-slate-400" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </SimpleDialog>
      {selectedIncidentId && (
        <DialogIncident
          incidentId={selectedIncidentId}
          open={selectedIncidentId !== undefined}
          onClose={() => setSelectedIncidentId(undefined)}
        />
      )}
    </>
  );
};
