import { api } from "@/trpc/server";
import { Equipamentos } from "./table";

export const dynamic = "force-dynamic"

export default async function EquipamentosPage() {
  const equipamentos = await api.hospitalManager.getEquipamentos.query();
  return <Equipamentos initialData={equipamentos} />;
}
