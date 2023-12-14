import { ColumnDef } from "@tanstack/react-table";
import { TableColumnHeader } from "./TableColumnHeader";
import { RouterOutputs, api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { GerenciamentoHospital } from "../forms/FormGerenciamentoHospital";
import { useState } from "react";
import { GerenciamentoHospitalProvider } from "../forms/FormGerenciamentoHospital.provider";
import { DataTableProvider } from "./DataTableContext";
import { DataTable } from "./DataTable";
import { DataTableSearch } from "./DataTableSearch";
import { DataTablePagination } from "./DataTablePagination";
import { Card } from "../ui/card";
import { BsPencilSquare } from "react-icons/bs";

type Hospital = RouterOutputs["destinations"]["getAll"][0];

export const TableHospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );
  const { data } = api.destinations.getAll.useQuery(undefined, {
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: ultimoRelatorio } =
    api.hospitalManager.obterRelatorioHospitalar.useQuery(
      { hospitalId: selectedHospital?.UnidadeCOD! },
      {
        enabled: !!selectedHospital,
      },
    );

  const columns: ColumnDef<Hospital>[] = [
    {
      accessorKey: "UnidadeCOD",
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
    },
    {
      accessorKey: "UnidadeDS",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Título" />
      ),
    },
    {
      accessorKey: "UnidadeCOD",
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedHospital(row.original)}
        >
          <BsPencilSquare size={20} className="text-primary" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {data && (
        <DataTableProvider columns={columns} data={data}>
          <DataTableSearch />
          <Card>
            <DataTable />
          </Card>
          <DataTablePagination />
        </DataTableProvider>
      )}
      {selectedHospital && (
        <Dialog
          open={!!selectedHospital}
          onOpenChange={() => setSelectedHospital(null)}
        >
          <DialogContent className="flex h-[90vh] max-w-7xl flex-col">
            <DialogHeader className="ml-4">
              <DialogTitle>{selectedHospital.UnidadeDS}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex h-1 flex-grow flex-col">
              <div className="px-4">
                {ultimoRelatorio && (
                  <GerenciamentoHospitalProvider
                    hospitalId={selectedHospital.UnidadeCOD}
                    ultimoRelatorio={ultimoRelatorio}
                  >
                    <GerenciamentoHospital />
                  </GerenciamentoHospitalProvider>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
