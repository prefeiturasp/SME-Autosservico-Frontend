import { TrendBadge } from "@/components/dashboard/MetricCard/TrendBadge";
import { cn } from "@/lib/utils";
import type { StatItem, StatVariant } from "@/types/metricas";

type Props = {
    readonly item: StatItem;
    readonly className?: string;
};

const VARIANT_COLORS: Record<StatVariant, string> = {
    neutral: "#3B82F6",
    success: "#075A3E",
    warning: "#9C6507",
    danger: "#970C0C",
    muted: "#6B7280",
    normal: "#111827",
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

function formatValue(item: StatItem): string {
    if (item.format === "currency") {
        return currencyFormatter.format(item.value);
    }
    if (item.format === "days") {
        return `${ptBrFormatter.format(item.value)} dias`;
    }
    return ptBrFormatter.format(item.value);
}

export default function StatItemBox({ item, className }: Props) {
    return (
        <div
            className={cn(
                "flex-1 space-y-1 rounded-md border border-[#D8D8D8] p-2",
                className,
            )}
        >
            <div
                className="text-2xl font-medium"
                style={{ color: VARIANT_COLORS[item.variant] }}
            >
                {formatValue(item)}
            </div>
            <div className="text-sm font-normal text-[#6B7280]">
                {item.label}
            </div>
            {item.trend && item.trendLabel && (
                <TrendBadge trend={item.trend} label={item.trendLabel} />
            )}
        </div>
    );
}
