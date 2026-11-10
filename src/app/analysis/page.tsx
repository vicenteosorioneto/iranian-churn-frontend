import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { PageHeader } from "@/components/common/PageHeader";
import { FeatureImportanceChart } from "@/components/charts/FeatureImportanceChart";
import { FEATURES } from "@/constants/features";

const typeLabels = {
  number: "Numérica",
  categorical: "Categórica",
  ordinal: "Ordinal",
} as const;

export default function AnalysisPage() {
  return (
    <>
      <PageHeader eyebrow="EXPLORAÇÃO" title="Análise das variáveis" description="Conheça os atributos usados pelos modelos e reserve visualizações para a análise exploratória dos dados." />
      <FeatureImportanceChart />
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
          <Typography variant="h6">Dicionário de atributos</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5} mb={2.5}>Mapeamento central entre os nomes exibidos e os campos enviados à API.</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5 }}>
            {FEATURES.map((feature) => (
              <Stack key={feature.apiName} direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Box>
                  <Typography fontWeight={650}>{feature.label}</Typography>
                  <Typography variant="caption" color="text.secondary">API: {feature.apiName}</Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.75}>{feature.description}</Typography>
                </Box>
                <Chip label={typeLabels[feature.type]} size="small" variant="outlined" />
              </Stack>
            ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
