import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGerenciamentoRedeRelatorioStore } from "../../stores";
import { GerenciamentoRedeFormRelatorioUnidade } from "./form";

export function GerenciamentoRedeDialogRelatorio() {
  const { open, relatorio, setOpen, setRelatorio } =
    useGerenciamentoRedeRelatorioStore();

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setRelatorio(null);
      }}
    >
      <DialogContent className="max-w-screen-xl">
        <GerenciamentoRedeFormRelatorioUnidade initialData={relatorio} />
        {relatorio && (
          <DialogDescription className="absolute bottom-0 p-6">
            Criado por {relatorio.criadoPor.operador?.OperadorNM} em{" "}
            {relatorio.createdAt.toLocaleString()}. <br />
            Editado pela última vez por{" "}
            {relatorio.editadoPor.operador?.OperadorNM} em{" "}
            {relatorio.updatedAt.toLocaleString()}.
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
}
