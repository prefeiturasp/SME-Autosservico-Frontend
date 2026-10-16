type Props = {
  readonly title: string;
};

export default function MetricasSectionHeader({ title }: Props) {
  return (
    <h2 className="mb-4 border-b border-[#1E3A8A] pb-2 text-lg font-bold text-[#1E3A8A]">
      {title}
    </h2>
  );
}
