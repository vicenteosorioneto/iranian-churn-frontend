"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import api from "@/services/api";
import type { ModelsComparison } from "@/types/metrics";
import { MetricsChart } from "@/components/charts/MetricsChart";
import { ChartPlaceholder } from "@/components/charts/ChartPlaceholder";

const rows = [
  ["Accuracy", "accuracy"],
  ["Precision", "precision"],
  ["Recall", "recall"],
  ["F1-score", "f1_score"],
  ["ROC-AUC", "roc_auc"],
] as const;

function formatMetric(value: number | null | undefined) {
  return typeof value === "number" ? `${(value * 100).toFixed(2)}%` : "—";
}

export function ModelsMetrics() {
  const [data, setData] = useState<ModelsComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ModelsComparison>("/models/metrics");
      setData(response.data);
    } catch (requestError) {
      setData(null);
      setError(axios.isAxiosError(requestError) && requestError.response
        ? "Não foi possível carregar as métricas fornecidas pela API."
        : "A API está indisponível no momento. As métricas permanecem sem valores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadInitialMetrics = async () => {
      try {
        const response = await api.get<ModelsComparison>("/models/metrics");
        if (active) setData(response.data);
      } catch (requestError) {
        if (active) {
          setError(axios.isAxiosError(requestError) && requestError.response
            ? "Não foi possível carregar as métricas fornecidas pela API."
            : "A API está indisponível no momento. As métricas permanecem sem valores.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialMetrics();
    return () => { active = false; };
  }, []);

  return (
    <>
      {error && (
        <Alert severity="warning" variant="outlined" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={() => void loadMetrics()}>Tentar novamente</Button>}>
          {error}
        </Alert>
      )}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2.5, pb: 1.5 }}>
            <Box>
              <Typography variant="h6" fontSize={17}>Tabela de métricas</Typography>
              <Typography variant="body2" color="text.secondary">Resultados retornados pelo backend para o conjunto de avaliação.</Typography>
            </Box>
            <Button startIcon={loading ? <CircularProgress size={16} /> : <RefreshRounded />} onClick={() => void loadMetrics()} disabled={loading}>
              Atualizar
            </Button>
          </Stack>
          <TableContainer>
            <Table aria-label="Comparação das métricas dos modelos">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fc" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Métrica</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Regressão Logística</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Random Forest</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(([label, key]) => (
                  <TableRow key={key} hover>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>{label}</TableCell>
                    <TableCell align="center">{loading ? <Skeleton width={64} sx={{ mx: "auto" }} /> : formatMetric(data?.logistic_regression[key])}</TableCell>
                    <TableCell align="center">{loading ? <Skeleton width={64} sx={{ mx: "auto" }} /> : formatMetric(data?.random_forest[key])}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "1.2fr .8fr" }, gap: 2.5, mb: 2.5 }}>
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" fontSize={16}>Comparação visual das métricas</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Desempenho relativo dos modelos.</Typography>
            {loading ? (
              <Skeleton variant="rounded" height={310} />
            ) : data ? (
              <MetricsChart data={data} />
            ) : (
              <Box sx={{ height: 310, display: "grid", placeItems: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2, bgcolor: "#fafbfc", textAlign: "center", p: 3 }}>
                <Typography variant="body2" color="text.secondary">Gráfico aguardando métricas válidas da API.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        <ChartPlaceholder title="Curva ROC" description="Comparação entre taxa de verdadeiros e falsos positivos." minHeight={240} />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, gap: 2.5 }}>
        <ChartPlaceholder title="Matriz de confusão — Regressão Logística" description="Distribuição de acertos e erros por classe." minHeight={220} />
        <ChartPlaceholder title="Matriz de confusão — Random Forest" description="Distribuição de acertos e erros por classe." minHeight={220} />
      </Box>
    </>
  );
}
