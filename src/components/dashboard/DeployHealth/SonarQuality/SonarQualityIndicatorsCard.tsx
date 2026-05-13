"use client";

import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSonarQualityMetrics } from "@/hooks/useSonarQualityMetrics";
import type { SonarQualityMetrics } from "@/types/sonarqube";
import type { DeployEnvironment } from "@/types/deployEnvironment";
import QualityGateHeader from "./QualityGateHeader";
import RatingSection from "./RatingSection";
import SonarMetricCard from "./SonarMetricCard";
import SonarQualityFooter from "./SonarQualityFooter";
import SonarQualityIndicatorsCardSkeleton from "./SonarQualityIndicatorsCard.skeleton";
import { ratingFromCoverage, ratingFromDuplication } from "./ratingStyles";
import {
  bugsHelper,
  codeSmellsHelper,
  coverageHelper,
  duplicationHelper,
  securityHotspotsHelper,
  vulnerabilitiesHelper,
} from "./helperTexts";

type Props = {
  readonly projectName?: string;
  readonly sonarProjectKey?: string;
  readonly zabbixQueryJenkinsJob?: string;
  readonly environment?: DeployEnvironment;
  readonly className?: string;
  readonly coverageMinimum?: number;
  readonly duplicationMaximum?: number;
};

function MetricsGrid({
  metrics,
  coverageMinimum,
  duplicationMaximum,
}: {
  metrics: SonarQualityMetrics["measures"];
  coverageMinimum: number;
  duplicationMaximum: number;
}) {
  const coverageRating = ratingFromCoverage(metrics.coverage, coverageMinimum);
  const duplicationRating = ratingFromDuplication(metrics.duplicatedLinesDensity, duplicationMaximum);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SonarMetricCard
        label="Bugs"
        value={metrics.bugs.toLocaleString("pt-BR")}
        helperText={bugsHelper(metrics.bugs, metrics.reliabilityRating)}
        rating={metrics.reliabilityRating}
      />
      <SonarMetricCard
        label="Cobertura de testes"
        value={`${metrics.coverage.toFixed(1).replace(".", ",")}%`}
        helperText={coverageHelper(coverageMinimum)}
        rating={coverageRating}
      />
      <SonarMetricCard
        label="Código duplicado"
        value={`${metrics.duplicatedLinesDensity.toFixed(1).replace(".", ",")}%`}
        helperText={duplicationHelper(duplicationMaximum)}
        rating={duplicationRating}
      />
      <SonarMetricCard
        label="Vulnerabilidades"
        value={metrics.vulnerabilities.toLocaleString("pt-BR")}
        helperText={vulnerabilitiesHelper(metrics.vulnerabilities)}
        rating={metrics.securityRating}
      />
      <SonarMetricCard
        label="Code Smells"
        value={metrics.codeSmells.toLocaleString("pt-BR")}
        helperText={codeSmellsHelper(metrics.ncloc)}
        rating={metrics.sqaleRating}
      />
      <SonarMetricCard
        label="Pontos de atenção em segurança"
        value={metrics.securityHotspots.toLocaleString("pt-BR")}
        helperText={securityHotspotsHelper(metrics.securityHotspots)}
        rating={metrics.securityReviewRating}
      />
    </div>
  );
}

export default function SonarQualityIndicatorsCard({
  projectName,
  sonarProjectKey,
  zabbixQueryJenkinsJob,
  environment,
  className,
  coverageMinimum = 80,
  duplicationMaximum = 5,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useSonarQualityMetrics({
    projectName: projectName ?? "",
    sonarProjectKey,
    zabbixQueryJenkinsJob,
    environment,
  });

  return (
    <Card className={cn("rounded-md shadow-sm gap-4 py-4 px-1", className)}>
      <CardHeader className="px-6 pb-0">
        <CardTitle className="text-base font-bold">
          SonarQube - Indicadores de qualidade
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">{renderBody()}</CardContent>
    </Card>
  );

  function renderBody() {
    if (!projectName) {
      return (
        <div className="text-sm text-muted-foreground">Selecione um projeto</div>
      );
    }

    if (isLoading || isFetching) {
      return <SonarQualityIndicatorsCardSkeleton />;
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar as métricas do SonarQube.
          </div>
          <Button
            onClick={() => refetch()}
            variant="secondary"
            size="sm"
            className="mt-3"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (!data.found) {
      return (
        <div className="text-sm text-muted-foreground">
          {data.message}. Verifique no servidor SonarQube se o projeto foi configurado.
        </div>
      );
    }

    const { qualityGate, measures, lastAnalysisAt } = data.data;

    return (
      <div className="flex flex-col gap-6">
        <QualityGateHeader
          status={qualityGate.status}
          failedCount={qualityGate.failedConditions.length}
          lastAnalysisAt={lastAnalysisAt}
          branch={data.data.branch}
        />
        <Separator />
        <MetricsGrid
          metrics={measures}
          coverageMinimum={coverageMinimum}
          duplicationMaximum={duplicationMaximum}
        />
        <RatingSection
          items={[
            { label: "Confiabilidade", rating: measures.reliabilityRating },
            { label: "Segurança", rating: measures.securityRating },
            { label: "Manutenção", rating: measures.sqaleRating },
          ]}
        />
        <Separator />
        <SonarQualityFooter
          acceptedIssues={measures.acceptedIssues}
          uncoveredLines={measures.uncoveredLines}
        />
      </div>
    );
  }
}
