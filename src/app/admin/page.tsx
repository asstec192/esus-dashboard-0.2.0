"use client";

import { UserRole } from "@/types/UserRole";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatProperName } from "@/utils/formatProperName";
import { useManageUsersStore } from "./hooks/useManageUsersStore";
import { AdminDialogCreateUser } from "./components/dialog-create-user";
import { AdminUserTable } from "./components/table-user";
import { AdminFormChangeOtherUserPassword } from "./components/form-change-other-user-password";
import { withRoles } from "@/components/HOCs/withRoles";

function Admin() {
  const selectedUser = useManageUsersStore((state) => state.selectedUser);
  const setSelectedUser = useManageUsersStore((state) => state.setSelectedUser);
  return (
    <div className="flex min-h-nav-offset flex-col p-4">
      <div className="mb-4 flex justify-end">
        <AdminDialogCreateUser />
      </div>
      <AdminUserTable />
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
          <AdminFormChangeOtherUserPassword />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Page = withRoles(Admin, [UserRole.admin], true);

export default Page;
