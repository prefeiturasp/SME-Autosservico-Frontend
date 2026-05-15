"use client";

import useDashboardStore from "@/states/dashboard";
import AnalyticsPeriodSwitcher from "./AnalyticsPeriodSwitcher";
import AnalyticsAutoRefreshIndicator from "./AnalyticsAutoRefreshIndicator";

export default function AnalyticsFilters() {
  const activeTab = useDashboardStore((state) => state.activeTab);
  const activePeriod = useDashboardStore((state) => state.activePeriod);
  const setActivePeriod = useDashboardStore((state) => state.setActivePeriod);

  if (activeTab !== "analytics") return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <AnalyticsPeriodSwitcher
        value={activePeriod}
        onChange={setActivePeriod}
      />
      {activePeriod === "hoje" && <AnalyticsAutoRefreshIndicator />}
    </div>
  );
}
