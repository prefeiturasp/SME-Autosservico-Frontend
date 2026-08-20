import ProvasCard from "./ProvasCard";

type Props = {
  readonly systemName?: string;
};

export default function ProvasSection({ systemName }: Props) {
  return (
    <div className="mb-8">
      <ProvasCard systemName={systemName} />
    </div>
  );
}
