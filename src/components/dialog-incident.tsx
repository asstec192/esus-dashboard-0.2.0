import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatProperName } from "@/utils/formatProperName";
import { getColorByRisk } from "@/utils/getColorByRisk";
import { Card } from "@/components/ui/card";
import { PopoverVeiculo } from "./popover-veiculo";
import { withRoles } from "@/components/HOCs/withRoles";
import { UserRole } from "@/types/UserRole";
import { addHours } from "date-fns";
import { useIncidentStore } from "@/hooks/useIncidentStore";

function DialogIncident() {
  const modalIncident = useIncidentStore((state) => state.modalIncident);
  const setModalIncident = useIncidentStore((state) => state.setModalIncident);
  const riskColor = getColorByRisk(modalIncident?.risco);
  return (
    <Dialog
      open={modalIncident !== undefined}
      onOpenChange={() => setModalIncident(undefined)}
    >
      {modalIncident && (
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader className="space-y-2">
            <DialogTitle style={{ color: riskColor }}>
              #{modalIncident.id}
            </DialogTitle>
            <TypographySmall>
              <b>Motivo: </b>
              {modalIncident.motivo}
            </TypographySmall>
            <TypographySmall>
              <b>Bairro: </b>
              {formatProperName(modalIncident.bairro)}
            </TypographySmall>
            <TypographySmall>
              <b>Data: </b>
              {addHours(new Date(modalIncident.data), 3).toLocaleString()}
            </TypographySmall>
            <div className="flex justify-center gap-1 sm:justify-start">
              {modalIncident.veiculos.map((veiculo, index) => (
                <PopoverVeiculo veiculo={veiculo} key={index} />
              ))}
            </div>
          </DialogHeader>

          <Separator />

          {modalIncident.pacientes.length > 0 && (
            <Tabs defaultValue={modalIncident.pacientes[0]!.id.toString()}>
              <TabsList className="flex h-max flex-wrap justify-start">
                {modalIncident.pacientes.map((paciente) => (
                  <TabsTrigger value={paciente.id.toString()} key={paciente.id}>
                    <b>{formatProperName(paciente.nome)}</b>
                  </TabsTrigger>
                ))}
              </TabsList>

              {modalIncident.pacientes.map((paciente) => (
                <TabsContent value={paciente.id.toString()} key={paciente.id}>
                  <div className="ml-4 mt-4 flex flex-wrap gap-x-10 gap-y-2">
                    <TypographySmall>
                      <b>ID: </b> #{paciente.id}
                    </TypographySmall>
                    <TypographySmall>
                      <b>Idade: </b> {paciente.idade} ano(s)
                    </TypographySmall>
                    <TypographySmall>
                      <b>Sexo: </b> {getGender(paciente.sexo)}
                    </TypographySmall>
                    <TypographySmall>
                      <b>Desfecho: </b> {paciente.ultima_decisao}
                    </TypographySmall>
                  </div>
                  <Card className="mt-4 p-2">
                    <ScrollArea className="h-[350px]">
                      {paciente.avaliacoes?.map((avaliacao, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-1 rounded bg-slate-100 px-2 py-1 [&:not(:first-child)]:mt-2"
                        >
                          <TypographySmall className="font-semibold">
                            {formatProperName(avaliacao.operador)}:
                          </TypographySmall>
                          <TypographyMuted>
                            {avaliacao.descricao}
                          </TypographyMuted>
                          <TypographySmall className="self-end text-xs ">
                            {new Date(avaliacao.data).toLocaleString()}
                          </TypographySmall>
                        </div>
                      ))}
                    </ScrollArea>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}

const genders: Record<string | number, string> = {
  1: "Masculino",
  2: "Feminino",
};

const getGender = (key?: string | number) => {
  if (!key) {
    return "Não informado";
  }
  return genders[key];
};

export const ProtectedDialogIncident = withRoles(DialogIncident, [
  UserRole.admin,
  UserRole.medico,
]);
