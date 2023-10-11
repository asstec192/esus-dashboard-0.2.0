import { GenderChart } from "../../components/chart-gender";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import AnalyticsLayout from "@/components/layouts/analytics-layout";
import { AgeChart } from "../../components/chart-age";
import { WeekDayChart } from "../../components/chart-week-day";
import { VehicleTypeChart } from "../../components/chart-vehicle";
import { TravelTimeChart } from "../../components/chart-hour";

const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <GenderChart className="aspect-video" />
      <AgeChart className="aspect-video" />
      <WeekDayChart className="aspect-video" />
      <VehicleTypeChart className="aspect-video" />
      <TravelTimeChart className="aspect-video" />
    </div>
  );
};

AnalyticsPage.getLayout = function getLayout(page: ReactElement) {
  return <AnalyticsLayout pageTitle="Epidemiologia">{page}</AnalyticsLayout>;
};

export default AnalyticsPage;
