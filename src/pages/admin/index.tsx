import { UserRole } from "@/types/UserRole";
import { DialogCreateUser } from "../../components/dialogs/DialogCreateUser";
import { withRoles } from "@/components/HOCs/withRoles";
import { UsersList } from "../../components/table-users";
import { SimpleDialog } from "@/components/dialogs/SimpleDialog";
import { FormChangeUserPassword } from "../../components/form-change-user-password";
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
      <UsersList />
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
