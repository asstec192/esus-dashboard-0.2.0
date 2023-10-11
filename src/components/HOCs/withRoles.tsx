import type { UserRole } from "@/types/UserRole";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function withRoles(
  Component: any,
  permissions: UserRole[],
  shouldRedirect = false,
) {
  return function WithRolesWrapper(props: any) {
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;

    if (!user || !permissions.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}
