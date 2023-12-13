import { UserRole } from "@/types/UserRole";
import { withRoles } from "../HOCs/withRoles";
import { Button, ButtonProps } from "../ui/button";
import { Plus } from "lucide-react";

export const ProtectedAddButton = withRoles<ButtonProps>(
  (props: ButtonProps) => (
    <Button size="icon" {...props}>
      <Plus />
    </Button>
  ),
  [UserRole.admin],
);
