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
import { RouterOutputs } from "@/trpc/shared";
import { Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { differenceInHours } from "date-fns";

export function RelatorioDeleteModal({
  relatorio,
}: {
  relatorio: RouterOutputs["hospitalManager"]["obterRelatorios"][0];
}) {
  const utils = api.useUtils();
  const { mutate: handleDeleteRelatorio } =
    api.hospitalManager.deleteRelatorio.useMutation({
      onSuccess: () => {
        utils.hospitalManager.obterRelatorios.invalidate(),
          utils.hospitalManager.obterRelatoriosAgrupadosPorHospitais.invalidate();
      },
      onError: (error) =>
        toast({ description: error.message, variant: "destructive" }),
    });

  const session = useSession();
  const isAuthor = relatorio.criadoPorId.toString() === session.data?.user.id;
  const deleteExpired = differenceInHours(new Date(), relatorio.createdAt) > 12;
  const deleteEnabled = isAuthor && !deleteExpired;

  if (!deleteEnabled) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, o registro do relatório{" "}
            <span className="font-semibold">{relatorio.id}</span> referente à
            unidade{" "}
            <span className="font-semibold">{relatorio.unidade.UnidadeDS}</span>{" "}
            será removido permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteRelatorio({ relatorioId: relatorio.id })}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
