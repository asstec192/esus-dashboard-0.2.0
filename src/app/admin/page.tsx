import { getServerAuthSession } from "@/server/auth";
import { AdminUserTable } from "./_components/table-user";
import { UserRole } from "@/types/UserRole";
import { redirect } from "next/navigation";
import { TypographyH3 } from "@/components/typography/TypographyH3";

export default async function AdminPage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/"); // redireciona para pagina de login
  }

  if (session.user.role !== UserRole.admin) {
    return (
      <main className="w-scree flex min-h-screen flex-col items-center justify-center">
        <TypographyH3>
          Olá espertinho, você não tem as permissões necessárias para acessar
          esta página!
        </TypographyH3>
      </main>
    );
  }

  return (
    <main className="flex min-h-nav-offset flex-col">
      <AdminUserTable />
    </main>
  );
}
