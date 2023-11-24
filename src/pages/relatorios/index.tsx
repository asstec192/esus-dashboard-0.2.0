import { FichaPDF } from "@/components/ficha-pdf";
import { TableHospitalEquipment } from "@/components/tables/TableHospitalEquipment";
import { TableHospitalSpecialties } from "@/components/tables/TableHospitalSpecialties";
import { TableHospitals } from "@/components/tables/TableHospitals";
import { TypographyH4 } from "@/components/typography/TypographyH4";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographySmall } from "@/components/typography/TypographySmall";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { addHours } from "date-fns";

export default function Relatorios() {
  return (
    <>
      {/* <Tabs defaultValue="hospitais">
        <TabsList>
          <TabsTrigger value="hospitais">Hospitais</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
          <TabsTrigger value="turnos">Turnos</TabsTrigger>
        </TabsList>
        <TabsContent value="hospitais">
          <TableHospitals />
        </TabsContent>
        <TabsContent value="equipamentos">
          <TableHospitalEquipment />
        </TabsContent>
        <TabsContent value="especialidades">
          <TableHospitalSpecialties />
        </TabsContent>
      </Tabs>
      <FichaPDF /> */}
    </>
  );
}
