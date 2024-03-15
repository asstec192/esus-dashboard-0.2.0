import { api } from "@/trpc/server";
import { UserDialogChangeOwnPassword } from "./dialog-change-own-password";
import { UserIncidents } from "./user-incidents";

export const dynamic = "force-dynamic";

export default async function UserProfile() {
  const ocorrencias = await api.users.getOcorrencias.query();
  return (
    <main className="flex flex-col">
      <UserIncidents data={ocorrencias} />
      <UserDialogChangeOwnPassword />
    </main>
  );
}
