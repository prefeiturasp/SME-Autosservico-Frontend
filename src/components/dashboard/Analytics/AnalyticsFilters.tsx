"use client";

import useDashboardStore from "@/states/dashboard";
import AnalyticsAutoRefreshIndicator from "./AnalyticsAutoRefreshIndicator";
import AnalyticsPeriodSwitcher from "./AnalyticsPeriodSwitcher";

export default function AnalyticsFilters() {
    const activeTab = useDashboardStore((state) => state.activeTab);
    const activePeriod = useDashboardStore((state) => state.activePeriod);
    const setActivePeriod = useDashboardStore((state) => state.setActivePeriod);

    if (activeTab !== "analytics") return null;

    return (
        <div className="flex flex-wrap items-center justify-end gap-3">
            <div id="onboarding-analytics-period" className="inline-flex">
                <AnalyticsPeriodSwitcher
                    value={activePeriod}
                    onChange={setActivePeriod}
                />
            </div>
            {activePeriod === "hoje" && <AnalyticsAutoRefreshIndicator />}
        </div>
    );
}
