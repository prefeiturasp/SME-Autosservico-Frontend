type Props = {
  readonly peakHour: string;
};

export default function PeakBadge({ peakHour }: Props) {
  return (
    <span className="inline-flex items-center rounded-lg bg-[#D6DFEF] px-4 py-2 text-sm font-semibold text-[#1F3D73]">
      Pico: {peakHour}
    </span>
  );
}
