import { api } from "@/trpc/server";
import { UserIncidents } from "./user-incidents";
import { UserDialogChangeOwnPassword } from "./dialog-change-own-password";

export const dynamic = "force-dynamic";

export default async function UserProfile() {
  const ocorrencias = await api.users.getOcorrencias.query();
  return (
    <main className="flex min-h-nav-offset flex-col p-4">
      <UserIncidents data={ocorrencias} />
      <UserDialogChangeOwnPassword />
    </main>
  );
}
