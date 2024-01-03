import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function withSession(Component: any) {
  return function WithSessionWrapper(props: any) {
    const { status } = useSession();
    const router = useRouter();

    if (status === "loading") {
      return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
      router.push("/");
      return null;
    }

    return <Component {...props} />;
  };
}
