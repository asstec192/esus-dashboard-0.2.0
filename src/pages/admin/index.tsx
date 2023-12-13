import { UserRole } from "@/types/UserRole";
import { DialogCreateUser } from "../../components/dialogs/DialogCreateUser";
import { withRoles } from "@/components/HOCs/withRoles";
import { TableUsers } from "../../components/tables/TableUsers";
import { FormChangeUserPassword } from "../../components/forms/FormChangeUserPassword";
import { useManageUsersStore } from "@/hooks/useManageUsersStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatProperName } from "@/utils/formatProperName";

function AdminPage() {
  const selectedUser = useManageUsersStore((state) => state.selectedUser);
  const setSelectedUser = useManageUsersStore((state) => state.setSelectedUser);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <DialogCreateUser />
      </div>
      <TableUsers />
      <Dialog
        open={!!selectedUser}
        onOpenChange={() => setSelectedUser(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Alterar senha de{" "}
              {formatProperName(selectedUser?.operador?.OperadorNM)}
            </DialogTitle>
          </DialogHeader>
          <FormChangeUserPassword />
        </DialogContent>
      </Dialog>
    </>
  );
}

const Page = withRoles(AdminPage, [UserRole.admin], true);

export default Page;
