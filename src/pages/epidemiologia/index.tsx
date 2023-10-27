import { ChartGender } from "../../components/charts/ChartGender";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { ChartAge } from "../../components/charts/ChartAge";
import { ChartWeekDay } from "../../components/charts/ChartWeekDay";
import { ChartVehicles } from "../../components/charts/ChartVehicles";
import { ChartHour } from "../../components/charts/ChartHour";

const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <ChartGender className="aspect-video" />
      <ChartAge className="aspect-video" />
      <ChartWeekDay className="aspect-video" />
      <ChartVehicles className="aspect-video" />
      <ChartHour className="aspect-video" />
    </div>
  );
};

AnalyticsPage.getLayout = function getLayout(page: ReactElement) {
  return <AnalyticsLayout pageTitle="Epidemiologia">{page}</AnalyticsLayout>;
};

export default AnalyticsPage;
