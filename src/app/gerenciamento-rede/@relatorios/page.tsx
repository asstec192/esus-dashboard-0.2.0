import { startOfToday } from "date-fns";

import { api } from "@/trpc/server";
import { Relatorios } from "./relatorios-table";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const date = startOfToday();
  const relatorios = await api.hospitalManager.obterRelatorios.query(date);
  return <Relatorios initialData={relatorios} />;
}
