import { ChartAge } from "@/components/charts/ChartAge";
import { ChartGender } from "@/components/charts/ChartGender";
import { ChartHour } from "@/components/charts/ChartHour";
import { ChartVehicles } from "@/components/charts/ChartVehicles";
import { ChartWeekDay } from "@/components/charts/ChartWeekDay";

export default function Epidemiologia() {
  return (
    <main className="flex min-h-nav-offset flex-col p-4">
      <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ChartGender className="aspect-video" />
        <ChartAge className="aspect-video" />
        <ChartWeekDay className="aspect-video" />
        <ChartVehicles className="aspect-video" />
        <ChartHour className="aspect-video" />
      </div>
    </main>
  );
}
