"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { GerenciamentoRedeFormRelatorioUnidade } from "./form";
import { useRouter } from "next/navigation";
import { useGerenciamentoRedeRelatorioStore } from "@/app/gerenciamento-rede/stores";

export default function RelatorioModal() {
  const router = useRouter();
  const relatorio = useGerenciamentoRedeRelatorioStore(
    (state) => state.relatorio,
  );
  const setRelatorio = useGerenciamentoRedeRelatorioStore(
    (state) => state.setRelatorio,
  );

  const onModalClose = () => {
    setRelatorio(null);
    router.back();
  };

  return (
    <Dialog defaultOpen onOpenChange={onModalClose}>
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
