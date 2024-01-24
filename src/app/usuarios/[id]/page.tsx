import { api } from "@/trpc/server";
import { UserIncidents } from "./user-incidents";
import { UserDialogChangeOwnPassword } from "./dialog-change-own-password";

export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  const ocorrencias = await api.users.getOcorrencias.query({
    esusId: params.id,
  });
  return (
    <main className="flex min-h-nav-offset flex-col p-4">
      <UserIncidents data={ocorrencias} />
      <UserDialogChangeOwnPassword />
    </main>
  );
}
