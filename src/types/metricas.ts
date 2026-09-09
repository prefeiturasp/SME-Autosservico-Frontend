import type { MetricTrend } from "@/types/metric";

export type ActiveAccessUsersResponse = {
    activeCount: number;
    trend: MetricTrend;
    trendLabel: string;
};

export type UniqueUsersPerDayResponse = {
    uniqueCount: number;
    trend: MetricTrend;
    trendLabel: string;
};

export type TodayAccessResponse = {
    accessCount: number;
    trend: MetricTrend;
    trendLabel: string;
};

export type UesAptasPrestarContasResponse = {
    count: number;
    trend: MetricTrend;
    trendLabel: string;
};

export type UsersByProfileResponse = {
    codae: number;
    dre: number;
    ue: number;
};

export type AccessComparisonBucket = {
    label: string;
    value: number;
    isPeak: boolean;
};

export type AccessComparisonResponse = {
    buckets: AccessComparisonBucket[];
};

export type StatVariant =
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "muted"
    | "normal";

export type StatItem = {
    label: string;
    value: number;
    variant: StatVariant;
    format?: "number" | "currency" | "days";
    trend?: MetricTrend;
    trendLabel?: string;
};

export type StatsCardResponse = {
    items: StatItem[];
};

export type TableRow = {
    label: string;
    value: number;
};

export type ProvasResponse = {
    items: StatItem[];
    progressPercentage: number;
};

export type ProgressStatsResponse = {
    items: StatItem[];
    progressPercentage: number;
};

export type ProfileBreakdownBlock = {
    title: string;
    rows: TableRow[];
};

export type ProfileDistributionItem = {
    label: string;
    percentage: number;
    color: string;
};

export type ProfileDistributionResponse = {
    items: ProfileDistributionItem[];
};

export type AnalistaTableRow = {
    analista: string;
    ocorrenciasTratadas: number;
    tempoMedio: string;
};
