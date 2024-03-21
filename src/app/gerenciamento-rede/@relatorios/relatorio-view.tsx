import { Eye } from "lucide-react";

import type { RouterOutputs } from "@/trpc/shared";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographyP } from "@/components/typography/TypographyP";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatProperName } from "@/utils/formatProperName";

function RelatorioView({
  relatorio,
}: {
  relatorio: RouterOutputs["hospitalManager"]["obterRelatorios"][0];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Eye className="w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Relatório #{relatorio.id} da unidade {relatorio.unidade.UnidadeDS}
          </DialogTitle>
          <DialogDescription>
            Criado por{" "}
            {formatProperName(relatorio.criadoPor.operador?.OperadorNM)} em{" "}
            {relatorio.createdAt.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div>
            <TypographyP>
              Contactou-se{" "}
              <span className="font-semibold">{relatorio.nomeContato}</span> às{" "}
              <span className="font-semibold">{relatorio.horaContato}</span>{" "}
              durante o turno{" "}
              <span className="font-semibold">{relatorio.turno}</span> através
              do fone <span className="font-semibold">{relatorio.contato}</span>
              .
            </TypographyP>
            <TypographyP>
              Chefe de equipe{" "}
              <span className="font-semibold">{relatorio.chefeEquipe}</span>.
            </TypographyP>

            <div className="mt-7 flex flex-col">
              {relatorio.UnidadeRelatorioEquipamentos.length === 0 ? (
                "Nenhum equipamento foi registrado."
              ) : (
                <>
                  A unidade possuia no momento os seguintes equipamentos:{" "}
                  {relatorio.UnidadeRelatorioEquipamentos.map((equipamento) => (
                    <span
                      key={equipamento.equipamentoId}
                      className="text-sm text-muted-foreground"
                    >
                      {equipamento.equipamento.descricao}:{" "}
                      {equipamento.quantidade}
                    </span>
                  ))}
                </>
              )}
            </div>
            <div className="mt-7 flex flex-col">
              {relatorio.UnidadeRelatorioEspecialidades.length === 0 ? (
                "Nenhuma especialidade foi registrada."
              ) : (
                <>
                  A unidade possuia no momento as seguintes especialidades:{" "}
                  {relatorio.UnidadeRelatorioEspecialidades.map(
                    (especialidade) => (
                      <span
                        key={especialidade.especialidadeId}
                        className="text-sm text-muted-foreground"
                      >
                        {especialidade.especialidade.descricao}:{" "}
                        {especialidade.quantidade}
                      </span>
                    ),
                  )}
                </>
              )}
            </div>
            <div className="mt-7 flex flex-col">
              <span>Observações adicionais:</span>
              <TypographyMuted>{relatorio.observacao}</TypographyMuted>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { RelatorioView };
