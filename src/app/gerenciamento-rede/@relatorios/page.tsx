import { startOfDay } from "date-fns";

import { api } from "@/trpc/server";
import { Relatorios } from "./relatorio-table";

//força a rota a ser dinamica, buscando sempre os dados mais recentes quando o usuário atualizar a página
export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const date = startOfDay(new Date());
  const relatorios = await api.hospitalManager.obterRelatorios.query(date);
  return <Relatorios initialData={relatorios} />;
}
