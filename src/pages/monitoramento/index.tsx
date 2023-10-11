import { DailyStatistics } from "../../components/statistics";
import { CallsChart } from "../../components/chart-calls";
import { RiskChart } from "../../components/chart-risk";
import { IncidentsInProgress } from "../../components/table-incidents-in-progress";

export default function Page() {
  return (
    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
      <IncidentsInProgress className="w-full lg:flex-[3] " />
      <div className="flex flex-[1] flex-wrap gap-2">
        <DailyStatistics className="w-full" />
        <CallsChart />
        <RiskChart />
      </div>
    </div>
  );
}
