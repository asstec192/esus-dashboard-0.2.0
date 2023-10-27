import type { UserRole } from "@/types/UserRole";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComponentType } from "react";

export function withRoles<T ={}>(
  Component: ComponentType<T>,
  permissions: UserRole[],
  shouldRedirect = false,
) {
  return function WithRolesWrapper(props: T) {
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user;

    if (!user || !permissions.includes(user.role)) {
      return null;
    }

    //@ts-ignore
    return <Component {...(props as T)} />;
  };
}
