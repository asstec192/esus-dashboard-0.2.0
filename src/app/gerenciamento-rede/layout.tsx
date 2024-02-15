import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

export default function GerenciamentoRedeLayout(props: {
  hospitais: ReactNode;
  especialidades: ReactNode;
  equipamentos: ReactNode;
  relatorios: ReactNode;
  modalRelatorio: ReactNode;
}) {
  return (
    <div className="flex min-h-nav-offset flex-col p-4">
      <Tabs defaultValue="relatorios">
        <TabsList>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="hospitais">Hospitais</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
        </TabsList>
        <TabsContent value="relatorios">{props.relatorios}</TabsContent>
        <TabsContent value="hospitais">{props.hospitais}</TabsContent>
        <TabsContent value="equipamentos">{props.equipamentos}</TabsContent>
        <TabsContent value="especialidades">{props.especialidades}</TabsContent>
      </Tabs>
      {props.modalRelatorio}
    </div>
  );
}
