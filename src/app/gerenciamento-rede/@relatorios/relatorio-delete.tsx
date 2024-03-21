import { differenceInHours } from "date-fns";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

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
import { UserRole } from "@/types/UserRole";

export function RelatorioDeleteModal({
  relatorio,
}: {
  relatorio: RouterOutputs["hospitalManager"]["obterRelatorios"][0];
}) {
  const session = useSession();
  const isAdmin = session.data?.user.role === UserRole.admin;
  const isAuthor = relatorio.criadoPorId.toString() === session.data?.user.id;
  const deleteExpired = differenceInHours(new Date(), relatorio.createdAt) > 12;
  const deleteEnabled = isAdmin || (isAuthor && !deleteExpired);

  const utils = api.useUtils();
  const { mutate } = api.hospitalManager.deleteRelatorio.useMutation({
    onSuccess: () => {
      utils.hospitalManager.obterRelatorios.invalidate(),
        utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  const handleDeleteRelatorio = () =>
    deleteEnabled && mutate({ relatorioId: relatorio.id });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={!deleteEnabled}>
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
            disabled={!deleteEnabled}
            onClick={handleDeleteRelatorio}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
