import { api } from "@/trpc/server";
import { Especialidades } from "./table";

export const dynamic = "force-dynamic";

export default async function EspecialidadesPage() {
  const especialidades = await api.hospitalManager.getEspecialidades.query();
  return <Especialidades initialData={especialidades} />;
}
