import { UserRole } from "@/types/UserRole";
import { withRoles } from "../HOCs/withRoles";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

type AddButtonProps = {
  onClick?: () => void;
};

export const ProtectedAddButton = withRoles<AddButtonProps>(
  ({ onClick }: AddButtonProps) => (
    <Button size="icon" onClick={onClick}>
      <Plus />
    </Button>
  ),
  [UserRole.admin],
);
