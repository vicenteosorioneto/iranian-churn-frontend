import { PageHeader } from "@/components/common/PageHeader";
import { ModelsMetrics } from "@/components/models/ModelsMetrics";

export default function ModelsPage() {
  return (
    <>
      <PageHeader eyebrow="AVALIAÇÃO" title="Comparação dos modelos" description="Compare o desempenho da Regressão Logística e do Random Forest com métricas calculadas pelo backend." />
      <ModelsMetrics />
    </>
  );
}
