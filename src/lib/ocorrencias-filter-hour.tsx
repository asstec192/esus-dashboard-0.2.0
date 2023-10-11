/*  import { hourOptions } from "@/app/(authenticated_routes)/(analytics)/ocorrencias/components/filter-form/radio-group-hour"
import { Prisma } from "@prisma/client"

type HourFilter = (typeof hourOptions)[number]

export const hourFilterQuerys: Record<HourFilter, Prisma.Sql> = {
  Todos: Prisma.empty,
  "7h-10h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '7:00:00' AND '10:00:00')`,
  "10h-13h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '10:00:00' AND '13:00:00')`,
  "13h-16h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '13:00:00' AND '16:00:00')`,
  "16h-19h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '16:00:00' AND '19:00:00')`,
  "19h-22h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '19:00:00' AND '22:00:00')`,
  "22h-1h": Prisma.sql`AND (CAST(o.DtHr AS TIME) >= '22:00:00' OR CAST(o.DtHr AS TIME)<= '1:00:00')`,
  "1h-4h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '1:00:00' AND '4:00:00')`,
  "4h-7h": Prisma.sql`AND (CAST(o.DtHr AS TIME) BETWEEN '4:00:00' AND '7:00:00')`,
}
 
 */