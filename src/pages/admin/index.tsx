import { UserRole } from "@/types/UserRole";
import { DialogCreateUser } from "../../components/dialogs/DialogCreateUser";
import { withRoles } from "@/components/HOCs/withRoles";
import { TableUsers } from "../../components/tables/TableUsers";
import { SimpleDialog } from "@/components/dialogs/SimpleDialog";
import { FormChangeUserPassword } from "../../components/forms/FormChangeUserPassword";
import { formatProperName } from "@/utils/formatProperName";
import { useManageUsersStore } from "@/hooks/useManageUsersStore";

function AdminPage() {
  const selectedUser = useManageUsersStore((state) => state.selectedUser);
  const setSelectedUser = useManageUsersStore((state) => state.setSelectedUser);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <DialogCreateUser />
      </div>
      <TableUsers />
      <SimpleDialog
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(undefined)}
        title={
          selectedUser?.operador
            ? `Alterar senha de ${formatProperName(
                selectedUser.operador.OperadorNM,
              )}`
            : ""
        }
      >
        <FormChangeUserPassword />
      </SimpleDialog>
    </>
  );
}

const Page = withRoles(AdminPage, [UserRole.admin], true);

export default Page;
