import EmpresasTerceirizadasCard from "./EmpresasTerceirizadasCard";
import MedicoesIniciaisCard from "./MedicoesIniciaisCard";
import MetricasSectionHeader from "./MetricasSectionHeader";
import ProdutosHomologadosCard from "./ProdutosHomologadosCard";
import SolicitacoesAlimentacoesCard from "./SolicitacoesAlimentacoesCard";
import SolicitacoesDietasEspeciaisCard from "./SolicitacoesDietasEspeciaisCard";

type Props = {
  readonly systemName?: string;
};

export default function AlimentacaoTerceirizadaSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Alimentação Terceirizada" />
      <div className="space-y-4">
        <MedicoesIniciaisCard systemName={systemName} />
        <ProdutosHomologadosCard systemName={systemName} />
        <EmpresasTerceirizadasCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <SolicitacoesAlimentacoesCard systemName={systemName} />
          <SolicitacoesDietasEspeciaisCard systemName={systemName} />
        </div>
      </div>
    </section>
  );
}
