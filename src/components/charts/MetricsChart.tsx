"use client";

import { Box } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ModelsComparison } from "@/types/metrics";

const metrics = [
  ["Accuracy", "accuracy"],
  ["Precision", "precision"],
  ["Recall", "recall"],
  ["F1-score", "f1_score"],
  ["ROC-AUC", "roc_auc"],
] as const;

export function MetricsChart({ data }: { data: ModelsComparison }) {
  const chartData = metrics.map(([label, key]) => ({
    metric: label,
    "Regressão Logística": data.logistic_regression[key],
    "Random Forest": data.random_forest[key],
  }));

  return (
    <Box sx={{ width: "100%", height: 310 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 12, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e9f2" />
          <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 1]} tickFormatter={(value: number) => `${Math.round(value * 100)}%`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => typeof value === "number" ? `${(value * 100).toFixed(1)}%` : "—"} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Regressão Logística" fill="#2856a6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Random Forest" fill="#16847a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
