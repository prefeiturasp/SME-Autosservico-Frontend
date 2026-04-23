import { DEVICE_COLORS, DEVICE_LABELS, DEVICE_KEYS, OFF_PEAK_COLOR } from "./constants";

export default function ChartLegend() {
  return (
    <div className="flex items-center justify-start gap-4 pt-4 text-sm text-gray-600">
      {DEVICE_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: DEVICE_COLORS[key] }}
          />
          <span>{DEVICE_LABELS[key]}</span>
        </div>
      ))}

      <span className="text-gray-300">|</span>

      <div className="flex items-center gap-1.5">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: OFF_PEAK_COLOR }}
        />
        <span>Fora do pico</span>
      </div>
    </div>
  );
}
