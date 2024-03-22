import { differenceInHours } from "date-fns";
import { useSession } from "next-auth/react";

import type { RouterOutputs } from "@/trpc/shared";
import { UserRole } from "@/types/UserRole";

export function useRelatorioPermissions(
  relatorio?: RouterOutputs["hospitalManager"]["obterRelatorios"][0],
) {
  const session = useSession();

  const user = session.data?.user;

  const isAdmin = user?.role === UserRole.admin;

  const isAuthor = relatorio?.criadoPorId.toString() === user?.id;

  const permissionExpired =
    relatorio && differenceInHours(new Date(), relatorio.createdAt) > 12;
    
  const hasPermission = isAdmin || (isAuthor && !permissionExpired);

  const permissions = {
    canCreate: !relatorio,
    canEdit: hasPermission,
    canDelete: hasPermission,
  };

  return permissions;
}
