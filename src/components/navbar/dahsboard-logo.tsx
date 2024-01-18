import Link from "next/link";

export const DashboardLogo = () => {
  return (
    <Link href="/">
      <div className="flex items-center text-lg font-bold">
        <span className="text-primary">SAMU</span>
        Dashboard
        <span className="ml-1 self-end text-xs font-normal">v0.3.5</span>
      </div>
    </Link>
  );
};
