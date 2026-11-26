"use client";

import { Box, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ModelsComparison } from "@/types/metrics";

const metrics = [
  ["Acurácia", "accuracy", "Acertos no total"],
  ["Precisão", "precision", "Dos alertas, quantos cancelaram"],
  ["Recall", "recall", "Dos que cancelaram, quantos achou"],
  ["F1-score", "f1", "Equilíbrio precisão × recall"],
  ["ROC-AUC", "roc_auc", "Separa quem sai de quem fica"],
] as const;

const percent = (value: unknown) => typeof value === "number" ? `${(value * 100).toFixed(1).replace(".", ",")}%` : "";

export function MetricsChart({ data }: { data: ModelsComparison }) {
  const chartData = metrics.map(([label, key, hint]) => ({
    metric: label,
    hint,
    "Regressão Logística": data.logistic_regression[key],
    "Random Forest": data.random_forest[key],
  }));

  return (
    <>
      <Box sx={{ width: "100%", height: 340 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 22, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e9f2" />
            <XAxis dataKey="metric" tick={{ fontSize: 12, fontWeight: 600 }} interval={0} />
            <YAxis domain={[0, 1]} tickFormatter={(value: number) => `${Math.round(value * 100)}%`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => percent(value) || "—"}
              labelFormatter={(label) => { const row = chartData.find(item => item.metric === label); return row ? `${label}: ${row.hint}` : String(label); }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Regressão Logística" fill="#2856a6" radius={[4, 4, 0, 0]}>
              <LabelList position="top" formatter={percent} style={{ fontSize: 10 }} />
            </Bar>
            <Bar dataKey="Random Forest" fill="#16847a" radius={[4, 4, 0, 0]}>
              <LabelList position="top" formatter={percent} style={{ fontSize: 10, fontWeight: 700 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box component="ul" sx={{ m: 0, mt: 1.5, pl: 2.5, color: "text.secondary", fontSize: 13, "& li": { mb: 0.25 } }}>
        {metrics.map(([label, , hint]) => <li key={label}><strong>{label}:</strong> {hint.toLowerCase()}.</li>)}
      </Box>
      <Typography variant="body2" sx={{ mt: 1.5, p: 1.25, bgcolor: "#f6f8fb", borderRadius: 1 }}>
        <strong>Leitura:</strong> quanto mais alta a barra, melhor (máximo 100%). O Random Forest (verde) supera a Regressão
        Logística (azul) principalmente em precisão e F1, ou seja, gera muito menos alarmes falsos.
      </Typography>
    </>
  );
}
