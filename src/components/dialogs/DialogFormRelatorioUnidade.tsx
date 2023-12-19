import { RouterOutputs } from "@/utils/api";
import { FormRelatorioUnidade } from "../forms/FormRelatorioUnidade";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { create } from "zustand";

type Relatorio = RouterOutputs["hospitalManager"]["obterRelatorio"];

type DialogFormRelatorioUnidadeStore = {
  open: boolean;
  relatorio: Relatorio;
  date: Date;
  setOpen: (value: boolean) => void;
  setRelatorio: (relatorio: Relatorio) => void;
  setDate: (date: Date) => void;
};

export const useDialogFormRelatorioUnidadeStore =
  create<DialogFormRelatorioUnidadeStore>()((set) => ({
    open: false,
    relatorio: null,
    date: new Date(),
    setOpen: (open) => set({ open }),
    setRelatorio: (relatorio) => set({ relatorio }),
    setDate: (date) => set({ date }),
  }));

export function DialogFormRelatorioUnidade() {
  const { open, relatorio, setOpen, setRelatorio } =
    useDialogFormRelatorioUnidadeStore();

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setRelatorio(null);
      }}
    >
      <DialogContent className="max-w-screen-xl">
        <DialogHeader></DialogHeader>
        <FormRelatorioUnidade initialData={relatorio} />
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
