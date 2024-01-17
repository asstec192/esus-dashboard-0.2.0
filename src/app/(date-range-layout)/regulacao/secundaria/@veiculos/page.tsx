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
import { Card } from "@/components/ui/card";
import { useVeiculos } from "./useVeiculos";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { RegulacaoSecundariaOcorrencias } from "../components/ocorrencias";
import Link from "next/link";
import { useRegulacaoSecundariaStore } from "../stores";
import { isWithinHour } from "@/utils/isWithinTurn";
import { addHours } from "date-fns";

export default function RegulacaoSecundariaVeiculos() {
  const {
    veiculos,
    ocorrenciasQuery,
    veiculoSelecionado,
    setVeiculoSelecionado,
  } = useVeiculos();
  const turno = useRegulacaoSecundariaStore((state) => state.turn);

  return (
    <div className="grid h-full grid-cols-5 gap-4">
      <Card className="col-span-full overflow-hidden lg:col-span-3">
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
                veiculos.map((veiculo) => (
                  <Link key={veiculo.id} href="#ocorrencias" legacyBehavior>
                    <TableRow
                      key={veiculo.id}
                      className="text-right"
                      role="button"
                      onClick={() => setVeiculoSelecionado(veiculo)}
                    >
                      <TableCell className="text-start font-medium">
                        {veiculo.nome}
                      </TableCell>
                      <TableCell>{veiculo.QTYQUS}</TableCell>
                      <TableCell>{veiculo.QUSQUY}</TableCell>
                      <TableCell>{veiculo.QUYQUU}</TableCell>
                      <TableCell>{veiculo.totalOcorrencias}</TableCell>
                      <TableCell>{veiculo.pacientes.length}</TableCell>
                    </TableRow>
                  </Link>
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

            <TableFooter className="sticky bottom-0 bg-primary text-primary-foreground">
              <TableRow className="text-end font-bold hover:bg-inherit">
                <TableCell />
                <TableCell>
                  {(veiculos &&
                    Math.ceil(
                      veiculos.reduce(
                        (acc, veiculo) => acc + (veiculo.QTYQUS || 0),
                        0,
                      ) / veiculos.length,
                    )) ||
                    ""}{" "}
                  (média)
                </TableCell>
                <TableCell>
                  {(veiculos &&
                    Math.ceil(
                      veiculos.reduce(
                        (acc, veiculo) => acc + (veiculo.QUSQUY || 0),
                        0,
                      ) / veiculos.length,
                    )) ||
                    ""}{" "}
                  (média)
                </TableCell>
                <TableCell>
                  {(veiculos &&
                    Math.ceil(
                      veiculos.reduce(
                        (acc, veiculo) => acc + (veiculo.QUYQUU || 0),
                        0,
                      ) / veiculos.length,
                    )) ||
                    ""}{" "}
                  (média)
                </TableCell>
                <TableCell>
                  {veiculos?.reduce(
                    (acc, veiculo) => acc + veiculo.totalOcorrencias,
                    0,
                  )}{" "}
                  (total)
                </TableCell>
                <TableCell>
                  {veiculos?.reduce(
                    (acc, veiculo) => acc + veiculo.pacientes.length,
                    0,
                  )}{" "}
                  (total)
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
      <RegulacaoSecundariaOcorrencias
        description={veiculoSelecionado?.nome || ""}
        ocorrencias={
          ocorrenciasQuery.data?.filter((o) => {
            const [veiculo] = o.OcorrenciaMovimentacao.filter(
              (om) => om.VeiculoID === veiculoSelecionado?.id,
            );
            return isWithinHour(
              addHours(veiculo?.EnvioEquipeDT!, 3),
              turno.from,
              turno.to,
            );
          }) || []
        }
      />
    </div>
  );
}
