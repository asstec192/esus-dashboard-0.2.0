import { DailyStatistics } from "../../components/statistics";
import { ChartCalls } from "../../components/charts/ChartCalls";
import { ChartRisk } from "../../components/charts/ChartRisk";
import { TableIncidentsInProgress } from "@/components/tables/TableIncidentsInProgress";

export default function Page() {
  return (
    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
      <TableIncidentsInProgress className="w-full lg:flex-[3] " />
      <div className="flex flex-[1] flex-wrap gap-2">
        <DailyStatistics className="w-full" />
        <ChartCalls />
        <ChartRisk />
      </div>
    </div>
  );
}
