import MetricasSectionHeader from "./MetricasSectionHeader";
import RelatoriosExportadosPorFormatoCard from "./RelatoriosExportadosPorFormatoCard";
import RelatoriosGeradosCard from "./RelatoriosGeradosCard";
import RelatoriosTotaisCard from "./RelatoriosTotaisCard";

type Props = {
  readonly systemName?: string;
};

export default function RelatoriosSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Relatórios" />
      <div className="space-y-4">
        <RelatoriosGeradosCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <RelatoriosTotaisCard systemName={systemName} />
          <RelatoriosExportadosPorFormatoCard systemName={systemName} />
        </div>
      </div>
    </section>
  );
}
