import type { HourlyAccess } from "@/types/peakHours";
import { DEVICE_COLORS, DEVICE_LABELS, DEVICE_KEYS } from "./constants";

type TooltipPayloadEntry = {
  payload: HourlyAccess;
};

type Props = {
  readonly active?: boolean;
  readonly payload?: TooltipPayloadEntry[];
  readonly peakHour: string;
};

export default function ChartTooltip({ active, payload, peakHour }: Props) {
  if (!active || !payload?.length) return null;

  const entry = payload[0]?.payload;
  if (!entry) return null;

  const isPeak = entry.hour === peakHour;
  const title = isPeak
    ? `${entry.hour} - Pico de acesso`
    : `${entry.hour} - Acesso`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold text-gray-900">
        {entry.total.toLocaleString("pt-BR")} usuarios
      </p>
      <div className="mt-2 space-y-1">
        {DEVICE_KEYS.map((key) => (
          <div key={key} className="flex items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: DEVICE_COLORS[key] }}
              />
              <span className="text-gray-600">{DEVICE_LABELS[key]}</span>
            </div>
            <span className="font-medium text-gray-900">
              {entry[key].toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
