/* import { ageOptions } from "@/app/(authenticated_routes)/(analytics)/ocorrencias/components/filter-form/radio-group-age"
import { Prisma } from "@prisma/client"

type AgeFilter = (typeof ageOptions)[number]

export const ageFilterQuerys: Record<AgeFilter, Prisma.Sql> = {
  Todas: Prisma.empty,
  "<13": Prisma.sql`AND EXISTS (
		SELECT 1
		FROM Vitimas v
		WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade < 13
	)`,
  "13-18": Prisma.sql`AND EXISTS (
    SELECT 1
    FROM Vitimas v
    WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade >= 13 AND v.Idade <= 18
  )`,
  "19-29": Prisma.sql`AND EXISTS (
		SELECT 1
		FROM Vitimas v
		WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade >= 19 AND v.Idade <= 29
	)`,
  "30-39": Prisma.sql`AND EXISTS (
		SELECT 1
		FROM Vitimas v
		WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade >= 30 AND v.Idade <= 39
	)`,
  "40-49": Prisma.sql`AND EXISTS (
		SELECT 1
		FROM Vitimas v
		WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade >= 40 AND v.Idade <= 49
	)`,
  "50-59": Prisma.sql`AND EXISTS (
		SELECT 1
		FROM Vitimas v
		WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade >= 50 AND v.Idade <= 59
	)`,
  ">59": Prisma.sql`AND EXISTS (
		SELECT 1
		FROM Vitimas v
		WHERE o.OcorrenciaID = v.OcorrenciaID AND v.Idade > 59
	)`,
}
 */