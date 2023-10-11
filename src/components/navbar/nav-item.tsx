import { usePathname } from "next/navigation";
import type { NavItemData } from "./useNavItems";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavItemProps {
  itemData: NavItemData;
  className?: string;
}

export default function NavItem({ itemData, className }: NavItemProps) {
  const active = itemData.pathname === usePathname();
  return (
    <Link
      href={itemData.pathname}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-black",
        active && "mt-[2px] border-b-2 border-primary font-semibold text-black",
        className,
      )}
    >
      {itemData.label}
    </Link>
  );
}
