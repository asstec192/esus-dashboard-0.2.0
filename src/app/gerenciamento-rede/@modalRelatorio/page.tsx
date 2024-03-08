import {
  DialogContent,
  DialogDescription,
  ParallelDialog,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/server";
import { GerenciamentoRedeFormRelatorioUnidade } from "./components/form";

// desabilita o cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ModalRelatorioPage({
  searchParams,
}: {
  searchParams: { isRelatorioOpen?: string; relatorioId: string };
}) {
  //não abre o modal se a query nao for verdadeira
  if (searchParams.isRelatorioOpen !== "true") return null;

  //converte o relatorioId do searchParam para numero
  const relatorioId = parseInt(searchParams.relatorioId, 10);

  //obtendo dados iniciais do relatorio
  const relatorioInicial = await api.hospitalManager.obterRelatorio.query({
    relatorioId: isNaN(relatorioId) ? 0 : relatorioId, //se relatorioId nao for um numero, usamos 0 como padrao
  });

  //obtendo os nomes dos hospitais
  const hospitais = await api.destinos.getAll.query();

  return (
    <ParallelDialog defaultOpen>
      <DialogContent className="max-w-screen-xl" >
        <ScrollArea className="h-[80vh] pr-4">
          <GerenciamentoRedeFormRelatorioUnidade
            initialData={relatorioInicial}
            hospitais={hospitais}
          />
        </ScrollArea>
      </DialogContent>
    </ParallelDialog>
  );
}
