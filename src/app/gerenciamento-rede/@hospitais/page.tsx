import { api } from "@/trpc/server";
import { GerenciamentoRedeHospitaisTable } from "./table";

export default async function GerenciamentoRedeHospitaisPage() {
  const hospitais = await api.destinations.getAll.query();
  return <GerenciamentoRedeHospitaisTable hospitais={hospitais} />;
}
