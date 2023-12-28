"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GerenciamentoRedeRelatorios } from "./components/relatorio/table";
import { GerenciamentoRedeUnidadesTable } from "./components/table-unidades";
import { GerenciamentoRedeTableEquipamentos } from "./components/table-equipamentos";
import { GerenciamentoRedeTableEspecialidades } from "./components/table-especialidades";
import { api } from "@/trpc/react";

export default function GerenciamentoRede() {
  const { data: especialidades } =
    api.hospitalManager.getEspecialidades.useQuery();
  const { data: equipamentos } = api.hospitalManager.getEquipamentos.useQuery();
  return (
    <div className="flex min-h-nav-offset flex-col p-4">
      <Tabs defaultValue="relatorios">
        <TabsList className="mb-4">
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="hospitais">Hospitais</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
        </TabsList>
        <TabsContent value="relatorios">
          <GerenciamentoRedeRelatorios />
        </TabsContent>
        <TabsContent value="hospitais">
          <GerenciamentoRedeUnidadesTable />
        </TabsContent>
        <TabsContent value="equipamentos">
          <GerenciamentoRedeTableEquipamentos
            equipamentos={equipamentos || []}
          />
        </TabsContent>
        <TabsContent value="especialidades">
          <GerenciamentoRedeTableEspecialidades
            especialidades={especialidades || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
