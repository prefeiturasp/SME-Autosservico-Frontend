import UnidadesProdutivasIndicadoresCard from "./UnidadesProdutivasIndicadoresCard";

type Props = {
  readonly systemName?: string;
};

export default function UnidadesProdutivasSection({ systemName }: Props) {
  return (
    <div className="mb-8">
      <UnidadesProdutivasIndicadoresCard systemName={systemName} />
    </div>
  );
}
