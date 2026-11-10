"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ModelsComparison } from "@/types/metrics";

function Matrix({ title, matrix }: { title: string; matrix: number[][] }) {
  if (matrix.length !== 2 || matrix.some(row => row.length !== 2)) {
    return <Typography color="text.secondary">Matriz indisponível.</Typography>;
  }
  return <Card><CardContent>
    <Typography variant="h6" mb={1}>{title}</Typography>
    <Typography variant="caption" color="text.secondary">Linhas: classe real (0 e 1). Colunas: classe prevista (0 e 1).</Typography>
    <Box component="table" sx={{ width: "100%", mt: 2, textAlign: "center", borderCollapse: "separate", borderSpacing: 1, "& td": { p: 2, bgcolor: "#edf3f7", borderRadius: 1 }, "& th": { p: 1 } }}>
      <thead><tr><th></th><th>Previsto 0</th><th>Previsto 1</th></tr></thead>
      <tbody>{matrix.map((row, i) => <tr key={i}><th>Real {i}</th>{row.map((value,j) => <td key={j}>{value}</td>)}</tr>)}</tbody>
    </Box>
  </CardContent></Card>;
}

export function ModelEvaluationCharts({ data }: { data: ModelsComparison }) {
  const logistic = data.logistic_regression.roc_curve || [];
  const forest = data.random_forest.roc_curve || [];
  const series = [
    ...logistic.map(p => ({ ...p, model: "Regressão Logística" })),
    ...forest.map(p => ({ ...p, model: "Random Forest" })),
  ];
  return <>
    <Card sx={{ mb: 2.5 }}><CardContent>
      <Typography variant="h6" mb={2}>Curvas ROC dos modelos</Typography>
      {series.length ? <Box sx={{ width: "100%", height: 310 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="fpr" domain={[0,1]} tickFormatter={n => Number(n).toFixed(1)} label={{ value: "Taxa de falsos positivos", position: "insideBottom", offset: -5 }} />
            <YAxis type="number" dataKey="tpr" domain={[0,1]} label={{ value: "Taxa de verdadeiros positivos", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={v => typeof v === "number" ? v.toFixed(3) : String(v)} />
            <Legend verticalAlign="top" />
            <Line name="Regressão Logística" data={logistic} type="linear" dataKey="tpr" stroke="#2856a6" strokeWidth={2} dot={false} isAnimationActive={false}/>
            <Line name="Random Forest" data={forest} type="linear" dataKey="tpr" stroke="#16847a" strokeWidth={2} dot={false} isAnimationActive={false}/>
          </LineChart>
        </ResponsiveContainer>
      </Box> : <Typography color="text.secondary">Curvas ainda não geradas. Execute novamente o treinamento no backend.</Typography>}
    </CardContent></Card>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs:"1fr", md:"repeat(2,1fr)" }, gap: 2.5 }}>
      <Matrix title="Matriz de confusão — Regressão Logística" matrix={data.logistic_regression.confusion_matrix} />
      <Matrix title="Matriz de confusão — Random Forest" matrix={data.random_forest.confusion_matrix} />
    </Box>
  </>;
}
