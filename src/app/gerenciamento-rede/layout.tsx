import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerAuthSession } from "@/server/auth";
import { UserRole } from "@/types/UserRole";
import type { ReactNode } from "react";

export default async function GerenciamentoRedeLayout(props: {
  hospitais: ReactNode;
  especialidades: ReactNode;
  equipamentos: ReactNode;
  relatorios: ReactNode;
  modalRelatorio: ReactNode;
}) {
  const session = await getServerAuthSession();
  const userRole = session?.user.role;
  return (
    <div className="flex min-h-nav-offset flex-col">
      <Tabs defaultValue="relatorios">
        <TabsList>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          {userRole === UserRole.admin ? (
            <>
              <TabsTrigger value="hospitais">Hospitais</TabsTrigger>
              <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
              <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
            </>
          ) : null}
        </TabsList>
        <TabsContent value="relatorios">{props.relatorios}</TabsContent>
        {userRole === UserRole.admin ? (
          <>
            <TabsContent value="hospitais">{props.hospitais}</TabsContent>
            <TabsContent value="equipamentos">{props.equipamentos}</TabsContent>
            <TabsContent value="especialidades">
              {props.especialidades}
            </TabsContent>
          </>
        ) : null}
      </Tabs>
      {props.modalRelatorio}
    </div>
  );
}
