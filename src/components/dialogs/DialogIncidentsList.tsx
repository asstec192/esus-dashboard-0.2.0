import { RouterOutputs } from "@/utils/api";
import { SimpleDialog } from "./SimpleDialog";
import { addHours } from "date-fns";
import { isWithinHour, isWithinTurn } from "@/utils/isWithinTurn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatProperName } from "@/utils/formatProperName";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { Turn } from "@/hooks/useTurnStore";
import { useIncidentStore } from "@/hooks/useIncidentStore";

export const DialogIncidentsList = ({
  data,
  open,
  onClose,
  turn,
}: {
  data: RouterOutputs["destinations"]["getIncidents"];
  open: boolean;
  onClose: () => void;
  turn: Turn;
}) => {
  const setSelectedIncidentId = useIncidentStore(
    (state) => state.setSelectedIncidentId,
  );
  return (
    <>
      <SimpleDialog open={open} onOpenChange={onClose} className="max-w-7xl">
        <ScrollArea className="relative max-h-[70vh] rounded-lg border bg-card shadow-sm">
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
              {data
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
                      {addHours(incident.DtHr!, 3).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </SimpleDialog>
    </>
  );
};
