"use client";

import { Pencil, Plus } from "lucide-react";

import type { RouterOutputs } from "@/trpc/shared";
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
import { cn } from "@/lib/utils";
import { useRelatorioPermissions } from "./_useRelatorioPermissions";
import { RelatorioForm } from "./relatorio-form";

function RelatorioFormModal({
  relatorioEditavel,
}: {
  relatorioEditavel?: RouterOutputs["hospitalManager"]["obterRelatorios"][0];
}) {
  const { canCreate, canEdit } = useRelatorioPermissions(relatorioEditavel);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={relatorioEditavel ? "secondary" : "default"}
          disabled={relatorioEditavel ? !canEdit : !canCreate}
          className={cn(!relatorioEditavel && "ml-auto h-8 w-16")}
        >
          {relatorioEditavel ? <Pencil className="w-4" /> : <Plus />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl">
        <ScrollArea className="h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <RelatorioForm relatorioEditavel={relatorioEditavel} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { RelatorioFormModal };
