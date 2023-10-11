/* import { vehicleOptions } from "@/app/(authenticated_routes)/(analytics)/ocorrencias/components/filter-form/radio-group-vehicle"
import { Prisma } from "@prisma/client"

type VehicleFilter = (typeof vehicleOptions)[number]

export const vehicleFilterQuerys: Record<VehicleFilter, Prisma.Sql> = {
  Todos: Prisma.empty,
  BIKE: Prisma.sql`AND EXISTS (
    SELECT 1
    FROM OcorrenciaMovimentacao om
    JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE o.OcorrenciaID = om.OcorrenciaID AND v.VeiculoDS LIKE 'BIKE%'
  )`,
  "M-0": Prisma.sql`AND EXISTS (
    SELECT 1
    FROM OcorrenciaMovimentacao om
    JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE o.OcorrenciaID = om.OcorrenciaID AND v.VeiculoDS LIKE 'M-0%'
  )`,
  MOT: Prisma.sql`AND EXISTS (
    SELECT 1
    FROM OcorrenciaMovimentacao om
    JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE o.OcorrenciaID = om.OcorrenciaID AND v.VeiculoDS LIKE 'MOT%'
  )`,
  USA: Prisma.sql`AND EXISTS (
    SELECT 1
    FROM OcorrenciaMovimentacao om
    JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE o.OcorrenciaID = om.OcorrenciaID AND v.VeiculoDS LIKE 'USA%'
  )`,
  USB: Prisma.sql`AND EXISTS (
    SELECT 1
    FROM OcorrenciaMovimentacao om
    JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE o.OcorrenciaID = om.OcorrenciaID AND v.VeiculoDS LIKE 'USB%'
  )`,
  USI: Prisma.sql`AND EXISTS (
    SELECT 1
    FROM OcorrenciaMovimentacao om
    JOIN Veiculos v ON om.VeiculoID = v.VeiculoID
    WHERE o.OcorrenciaID = om.OcorrenciaID AND v.VeiculoDS LIKE 'USI%'
  )`,
}
 */
