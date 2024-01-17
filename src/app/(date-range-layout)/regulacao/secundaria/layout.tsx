"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useState } from "react";
import { RegulacaoSecundariaSelectTurno } from "./components/select-turno";

export default function RegulacaoSecundariaLayout({
  veiculos,
  unidadesDestino,
  intercorrencias,
  modalPDFVeiculos,
}: {
  children: ReactNode;
  veiculos: ReactNode;
  unidadesDestino: ReactNode;
  intercorrencias: ReactNode;
  modalPDFVeiculos: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("veiculos");
  return (
    <div className="min-h-nav-offset px-1 py-4 sm:px-4">
      <Tabs defaultValue="veiculos" onValueChange={setActiveTab}>
        <div className="flex flex-wrap gap-2">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger className="flex-grow sm:flex-grow-0" value="veiculos">
              Veículos
            </TabsTrigger>
            <TabsTrigger className="flex-grow sm:flex-grow-0" value="destinos">
              Destinos
            </TabsTrigger>
            <TabsTrigger
              className="flex-grow sm:flex-grow-0"
              value="intercorrencias"
            >
              Intercorrências
            </TabsTrigger>
          </TabsList>
          <RegulacaoSecundariaSelectTurno />
          {activeTab === "veiculos" ? modalPDFVeiculos : null}
        </div>
        <TabsContent value="veiculos">{veiculos}</TabsContent>
        <TabsContent value="destinos">{unidadesDestino}</TabsContent>
        <TabsContent value="intercorrencias">{intercorrencias}</TabsContent>
      </Tabs>
    </div>
  );
}
