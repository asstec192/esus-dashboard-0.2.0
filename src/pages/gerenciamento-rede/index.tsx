import { TableHospitalEquipment } from "@/components/tables/TableHospitalEquipment";
import { TableHospitalSpecialties } from "@/components/tables/TableHospitalSpecialties";
import { TableHospitals } from "@/components/tables/TableHospitals";
import { TableRelatoriosRedeHospitalar } from "@/components/tables/TableRelatoriosRedeHospitalar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";

export default function Relatorios() {
  const { data: especialidades } =
    api.hospitalManager.getEspecialidades.useQuery();
  const { data: equipamentos } = api.hospitalManager.getEquipamentos.useQuery();
  return (
    <>
      <Tabs defaultValue="relatorios">
        <TabsList className="mb-4">
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="hospitais">Hospitais</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
        </TabsList>
        <TabsContent value="relatorios">
          <TableRelatoriosRedeHospitalar />
        </TabsContent>
        <TabsContent value="hospitais">
          <TableHospitals />
        </TabsContent>
        <TabsContent value="equipamentos">
          <TableHospitalEquipment equipamentos={equipamentos || []} />
        </TabsContent>
        <TabsContent value="especialidades">
          <TableHospitalSpecialties especialidades={especialidades || []} />
        </TabsContent>
      </Tabs>
    </>
  );
}
