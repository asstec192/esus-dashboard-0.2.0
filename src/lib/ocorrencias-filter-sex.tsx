/* import { sexOptions } from "@/app/(authenticated_routes)/(analytics)/ocorrencias/components/filter-form/radio-group-sex"
import { Prisma } from "@prisma/client"

type SexOption = (typeof sexOptions)[number]

export const sexFilterQuerys: Record<SexOption, Prisma.Sql> = {
  Ambos: Prisma.empty,
  Masculino: Prisma.sql`AND EXISTS (
      SELECT 1
      FROM Vitimas v
      WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Sexo = 1
    )`,
  Feminino: Prisma.sql`AND EXISTS (
    SELECT 1
    FROM Vitimas v
    WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Sexo = 2
  )`,
}
 */