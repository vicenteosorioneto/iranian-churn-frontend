"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "@/services/api";

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

  return <Card sx={{ mb: 3 }}><CardContent>
    <Typography variant="h6" mb={1}>Importância das variáveis — Random Forest</Typography>
    <Typography variant="body2" color="text.secondary" mb={2}>
      Variação média da ROC-AUC após embaralhar cada variável no conjunto de teste.
      Valores maiores indicam maior dependência do modelo nessa avaliação, não causalidade.
    </Typography>
    {loading && <CircularProgress size={23}/>}
    {error && <Alert severity="info">{error}</Alert>}
    {scores && <Box sx={{ width:"100%", height:Math.max(320, scores.features.length * 34) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={scores.features} margin={{ top:8,right:18,left:65,bottom:8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="feature" width={160} tick={{ fontSize:11 }} />
          <Tooltip formatter={value => typeof value === "number" ? value.toFixed(4) : String(value)} />
          <Bar dataKey="importance_mean" name="Importância (ROC-AUC)" fill="#16847a" />
        </BarChart>
      </ResponsiveContainer>
    </Box>}
  </CardContent></Card>;
}
