import AgendamentosRolesIndicadoresCard from "./AgendamentosRolesIndicadoresCard";

type Props = {
  readonly systemName?: string;
};

export default function AgendamentosRolesSection({ systemName }: Props) {
  return (
    <div className="mb-8">
      <AgendamentosRolesIndicadoresCard systemName={systemName} />
    </div>
  );
}
