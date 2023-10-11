import { AdminUserActionDropdownMenu } from "@/components/dropdown-admin-actions";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { formatProperName } from "@/utils/formatProperName";
import { ScrollArea } from "@/components/ui/scroll-area";

export const UsersList = () => {
  const {
    data: users,
    isError,
    isLoading,
    error,
  } = api.users.getAll.useQuery(undefined, {
    onError: (error) => {
      toast({
        title: "Houve um erro ao buscar a lista de usuários",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return (
    <Card>
      {isLoading || isError ? (
        <p>...carregando</p>
      ) : (
        <ScrollArea orientation="horizontal">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Apelido</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cadastrado Em</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow>
                  <TableCell className="font-bold">{user.id}</TableCell>
                  <TableCell className="font-medium">
                    {formatProperName(user.operador?.OperadorNM!)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.operador?.OperadorApelido}
                  </TableCell>
                  <TableCell className="font-medium">{user.role}</TableCell>
                  <TableCell className="font-medium">
                    {user.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.updatedAt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <AdminUserActionDropdownMenu user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </Card>
  );
};
