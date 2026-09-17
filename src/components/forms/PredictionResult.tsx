import { CheckCircleOutlined, ModelTrainingOutlined, PercentOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import type { PredictionResponse } from "@/types/prediction";

function modelLabel(model: string) {
  if (model === "random_forest") return "Random Forest";
  if (model === "logistic_regression") return "Regressão Logística";
  return model.replaceAll("_", " ");
}

export function PredictionResult({ result }: { result: PredictionResponse }) {
  return (
    <Card sx={{ borderColor: result.prediction === 1 ? "warning.light" : "success.light" }}>
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="overline" color="text.secondary">RESULTADO DA PREDIÇÃO</Typography>
            <Typography variant="h5" mt={0.25}>{result.classification}</Typography>
          </Box>
          <CheckCircleOutlined color={result.prediction === 1 ? "warning" : "success"} sx={{ fontSize: 42 }} />
        </Stack>
        <Divider sx={{ my: 2.5 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "#f8f9fc" }}>
            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <PercentOutlined fontSize="small" />
              <Typography variant="body2">Probabilidade</Typography>
            </Stack>
            <Typography variant="h5" mt={1}>{(result.probability * 100).toFixed(1)}%</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, borderRadius: 2, bgcolor: "#f8f9fc" }}>
            <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
              <ModelTrainingOutlined fontSize="small" />
              <Typography variant="body2">Modelo utilizado</Typography>
            </Stack>
            <Chip label={modelLabel(result.model)} color="primary" variant="outlined" sx={{ mt: 1 }} />
          </Box>
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
          A predição é um apoio analítico e deve ser interpretada em conjunto com o contexto do estudo.
        </Typography>
      </CardContent>
    </Card>
  );
}
