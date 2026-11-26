"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "@/services/api";
import { FEATURES } from "@/constants/features";

interface FeatureScore {
  feature: string;
  importance_mean: number;
  importance_std: number;
}
interface ImportanceResponse {
  model_name: string;
  scoring: string;
  features: FeatureScore[];
}

const LABELS: Record<string, string> = {
  ...Object.fromEntries(FEATURES.map(feature => [feature.apiName, feature.label])),
  Complains: "Reclamação",
  Status: "Status (ativo/inativo)",
};

const formatScore = (value: number) => value.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function FeatureImportanceChart() {
  const [scores, setScores] = useState<ImportanceResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get<ImportanceResponse>("/models/feature-importance")
      .then(response => { if (active) setScores(response.data); })
      .catch(() => { if (active) setError("Importâncias ainda não disponíveis. Execute o treinamento no backend."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const rows = scores
    ? [...scores.features]
        .sort((a, b) => b.importance_mean - a.importance_mean)
        .map(score => ({ ...score, label: LABELS[score.feature] ?? score.feature }))
    : [];
  const top = rows.slice(0, 3).map(row => row.label);

  return <Card sx={{ mb: 3 }}><CardContent>
    <Typography variant="h6" mb={1}>Quais informações o modelo mais usa para prever o cancelamento?</Typography>
    <Typography variant="body2" color="text.secondary" mb={2}>
      Para cada variável, embaralhamos seus valores e medimos quanto o Random Forest piora (queda na ROC-AUC).
      <strong> Barra maior = o modelo depende mais dessa informação.</strong> Barra perto de zero (ou levemente negativa) = o modelo quase não usa essa informação.
      Isso mostra dependência do modelo, não causa do cancelamento.
    </Typography>
    {loading && <CircularProgress size={23}/>}
    {error && <Alert severity="info">{error}</Alert>}
    {scores && <Box sx={{ width:"100%", height:Math.max(340, rows.length * 34 + 40) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={rows} margin={{ top:8,right:56,left:8,bottom:24 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={value => formatScore(Number(value))}
            label={{ value: "Queda na ROC-AUC quando a variável é embaralhada", position: "insideBottom", offset: -14, fontSize: 12, fill: "#666" }} />
          <YAxis type="category" dataKey="label" width={190} tick={{ fontSize:12 }} interval={0} />
          <Tooltip formatter={value => typeof value === "number" ? [`${formatScore(value)} de queda na ROC-AUC`, "Importância"] : String(value)} />
          <Bar dataKey="importance_mean" name="Importância" fill="#16847a" radius={[0, 4, 4, 0]}>
            <LabelList dataKey="importance_mean" position="right" formatter={(value: unknown) => typeof value === "number" ? formatScore(value) : ""} style={{ fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>}
    {top.length === 3 && <Typography variant="body2" sx={{ mt: 1.5, p: 1.25, bgcolor: "#f6f8fb", borderRadius: 1 }}>
      <strong>Leitura:</strong> as três informações mais usadas pelo modelo são {top[0]}, {top[1]} e {top[2]}.
    </Typography>}
  </CardContent></Card>;
}
