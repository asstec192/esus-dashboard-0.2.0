/* import { dayOptions } from "@/app/(authenticated_routes)/(analytics)/ocorrencias/components/filter-form/radio-group-day"
import { Prisma } from "@prisma/client"

type DayFilter = (typeof dayOptions)[number]

export const dayFilterQuerys: Record<DayFilter, Prisma.Sql> = {
  Todos: Prisma.empty,
  Dom: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 1`,
  Seg: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 2`,
  Ter: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 3`,
  Qua: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 4`,
  Qui: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 5`,
  Sex: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 6`,
  Sab: Prisma.sql`AND DATEPART(WEEKDAY, o.DtHr) = 7`,
}
 */