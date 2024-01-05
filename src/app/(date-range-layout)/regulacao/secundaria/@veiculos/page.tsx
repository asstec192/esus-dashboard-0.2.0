"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useVeiculos } from "./useVeiculos";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";

export default function RegulacaoSecundariaVeiculos() {
  const { getOcorrencias, isLoadingOcorrencias, veiculos } = useVeiculos();

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="h-[calc(100vh-9rem)]">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-100">
            <TableRow>
              <TableHead>Veículo</TableHead>
              <TableHead className="text-end">
                Chegada ao local - QTY QUS (min)
              </TableHead>
              <TableHead className="text-end">
                Atendimento no local - QUS QUY (min)
              </TableHead>
              <TableHead className="text-end">
                Chegada ao destino - QUY QUU (min)
              </TableHead>
              <TableHead className="text-end">N° de Ocorrências</TableHead>
              <TableHead className="text-end">N° de Pacientes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!veiculos ? (
              <SkeletonTable numberOfCols={6} numberOfRows={10} />
            ) : (
              veiculos.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
                  onClick={() => getOcorrencias(vehicle.id)}
                  className="text-right"
                  role="button"
                >
                  <TableCell className="text-start font-medium">
                    {vehicle.nome}
                  </TableCell>
                  <TableCell>{vehicle.QTYQUS}</TableCell>
                  <TableCell>{vehicle.QUSQUY}</TableCell>
                  <TableCell>{vehicle.QUYQUU}</TableCell>
                  <TableCell>{vehicle.totalOcorrencias}</TableCell>
                  <TableCell>{vehicle.pacientes.length}</TableCell>
                </TableRow>
              ))
            )}
            {veiculos && veiculos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter className="bg-primary text-primary-foreground sticky bottom-0">
            <TableRow className="text-end font-bold hover:bg-inherit">
              <TableCell className="text-start">Média</TableCell>
              <TableCell>
                {(veiculos &&
                  Math.ceil(
                    veiculos.reduce(
                      (acc, vehicle) => acc + (vehicle.QTYQUS || 0),
                      0,
                    ) / veiculos.length,
                  )) ||
                  ""}
              </TableCell>
              <TableCell>
                {(veiculos &&
                  Math.ceil(
                    veiculos.reduce(
                      (acc, vehicle) => acc + (vehicle.QUSQUY || 0),
                      0,
                    ) / veiculos.length,
                  )) ||
                  ""}
              </TableCell>
              <TableCell>
                {(veiculos &&
                  Math.ceil(
                    veiculos.reduce(
                      (acc, vehicle) => acc + (vehicle.QUYQUU || 0),
                      0,
                    ) / veiculos.length,
                  )) ||
                  ""}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {isLoadingOcorrencias && (
        <Loader2
          size={30}
          className="text-primary fixed left-1/2 top-1/2 animate-spin"
        />
      )}
    </Card>
  );
}
