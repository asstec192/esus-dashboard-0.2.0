import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type NavlinkProps = {
  active?: boolean;
  children: ReactNode;
  href: string;
  className?: string;
};

export function Navlink({ active, children, href, className }: NavlinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "text-muted-foreground",
        active && "border-b-4 border-primary",
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
