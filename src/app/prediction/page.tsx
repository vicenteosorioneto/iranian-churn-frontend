import { Alert } from "@mui/material";
import { PageHeader } from "@/components/common/PageHeader";
import { PredictionForm } from "@/components/forms/PredictionForm";

export default function PredictionPage() {
  return (
    <>
      <PageHeader eyebrow="INFERÊNCIA" title="Prever churn" description="Informe os atributos de um cliente para solicitar a classificação ao modelo disponibilizado pela API." />
      <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
        Nenhum resultado é simulado: o painel de resultado aparecerá somente após uma resposta válida de <strong>POST /api/predict</strong>.
      </Alert>
      <PredictionForm />
    </>
  );
}
