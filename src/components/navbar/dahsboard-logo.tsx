import Link from "next/link";

export const DashboardLogo = () => {
  return (
    <Link href="/" className="flex flex-col items-start">
      <div className="flex items-center text-lg font-bold leading-none">
        <span className="text-primary">SGRU</span>
        Dashboard
      </div>
      <span className="text-xs font-normal">versão de teste 0.6.0</span>
    </Link>
  );
};
