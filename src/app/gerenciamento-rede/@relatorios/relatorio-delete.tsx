import { Trash2 } from "lucide-react";

import type { RouterOutputs } from "@/trpc/shared";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { useRelatorioPermissions } from "./_useRelatorioPermissions";

export function RelatorioDeleteModal({
  relatorio,
}: {
  relatorio: RouterOutputs["hospitalManager"]["obterRelatorios"][0];
}) {
  const { canDelete } = useRelatorioPermissions(relatorio);

  const utils = api.useUtils();
  const { mutate } = api.hospitalManager.deleteRelatorio.useMutation({
    onSuccess: async () => {
      await utils.hospitalManager.obterRelatorios.invalidate(),
        await utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const handleDeleteRelatorio = () =>
    canDelete && mutate({ relatorioId: relatorio.id });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={!canDelete}>
          <Trash2 className="w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, o relatório{" "}
            <span className="font-semibold">{relatorio.id}</span> referente à
            unidade{" "}
            <span className="font-semibold">{relatorio.unidade.UnidadeDS}</span>{" "}
            será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={!canDelete}
            onClick={handleDeleteRelatorio}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
