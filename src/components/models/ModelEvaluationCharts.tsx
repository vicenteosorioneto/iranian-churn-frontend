"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ModelsComparison } from "@/types/metrics";

const CLASS_NAMES = ["Ficou", "Cancelou"];
const CELL_INFO = [
  [{ text: "Acerto: previu que ficaria e ficou", good: true }, { text: "Alarme falso: previu cancelamento, mas ficou", good: false }],
  [{ text: "Não detectado: cancelou sem alerta", good: false }, { text: "Acerto: previu cancelamento e cancelou", good: true }],
];

const auc = (value: number | null) => typeof value === "number" ? value.toFixed(3).replace(".", ",") : "—";

function Matrix({ title, matrix }: { title: string; matrix: number[][] }) {
  if (matrix.length !== 2 || matrix.some(row => row.length !== 2)) {
    return <Typography color="text.secondary">Matriz indisponível.</Typography>;
  }
  const [[tn, fp], [fn, tp]] = matrix;
  const total = tn + fp + fn + tp;
  return <Card><CardContent>
    <Typography variant="h6" mb={0.5}>{title}</Typography>
    <Typography variant="body2" color="text.secondary">
      Cada célula conta clientes do conjunto de teste. Linhas: o que aconteceu de verdade. Colunas: o que o modelo previu.
      <Box component="span" sx={{ color: "#1e7a4a", fontWeight: 600 }}> Verde = acerto</Box>,
      <Box component="span" sx={{ color: "#b2413a", fontWeight: 600 }}> vermelho = erro</Box>.
    </Typography>
    <Box component="table" sx={{ width: "100%", mt: 2, textAlign: "center", borderCollapse: "separate", borderSpacing: 4, "& td": { p: 1.5, borderRadius: 1, verticalAlign: "top" }, "& th": { p: 1, fontSize: 13 } }}>
      <thead><tr><th></th>{CLASS_NAMES.map(name => <th key={name}>Previsto: {name}</th>)}</tr></thead>
      <tbody>{matrix.map((row, i) => <tr key={i}>
        <th style={{ textAlign: "right" }}>Real: {CLASS_NAMES[i]}</th>
        {row.map((value, j) => {
          const info = CELL_INFO[i][j];
          return <td key={j} style={{ background: info.good ? "#e3f3ea" : "#fbe7e5" }}>
            <Typography fontSize={24} fontWeight={700} color={info.good ? "#1e7a4a" : "#b2413a"}>{value}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.3}>{info.text}</Typography>
          </td>;
        })}
      </tr>)}</tbody>
    </Box>
    <Typography variant="body2" sx={{ mt: 1.5, p: 1.25, bgcolor: "#f6f8fb", borderRadius: 1 }}>
      <strong>Leitura:</strong> acertou {tn + tp} de {total} clientes. Encontrou {tp} dos {fn + tp} que cancelaram,
      deixou passar {fn} e deu {fp} {fp === 1 ? "alarme falso" : "alarmes falsos"}.
    </Typography>
  </CardContent></Card>;
}

export function ModelEvaluationCharts({ data }: { data: ModelsComparison }) {
  const logistic = data.logistic_regression.roc_curve || [];
  const forest = data.random_forest.roc_curve || [];
  const diagonal = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];
  const hasCurves = logistic.length > 0 || forest.length > 0;
  return <>
    <Card sx={{ mb: 2.5 }}><CardContent>
      <Typography variant="h6" mb={0.5}>Curva ROC: o modelo separa bem quem sai de quem fica?</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Eixo vertical: % dos clientes que cancelaram e foram detectados. Eixo horizontal: % dos clientes que ficaram e receberam alarme falso.
        <strong> Quanto mais a curva sobe rápido e encosta no canto superior esquerdo, melhor.</strong> A linha cinza tracejada é um palpite aleatório.
      </Typography>
      {hasCurves ? <Box sx={{ width: "100%", height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 20, left: 10, bottom: 22 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="fpr" domain={[0,1]} tickFormatter={n => `${Math.round(Number(n) * 100)}%`} label={{ value: "Alarmes falsos (% dos que ficaram)", position: "insideBottom", offset: -14, fontSize: 12 }} />
            <YAxis type="number" dataKey="tpr" domain={[0,1]} tickFormatter={n => `${Math.round(Number(n) * 100)}%`} label={{ value: "Cancelamentos detectados", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12 } }} />
            <Tooltip formatter={v => typeof v === "number" ? `${(v * 100).toFixed(1).replace(".", ",")}%` : String(v)} labelFormatter={v => `Alarmes falsos: ${(Number(v) * 100).toFixed(1).replace(".", ",")}%`} />
            <Legend verticalAlign="top" />
            <Line name={`Regressão Logística (AUC ${auc(data.logistic_regression.roc_auc)})`} data={logistic} type="linear" dataKey="tpr" stroke="#2856a6" strokeWidth={2} dot={false} isAnimationActive={false}/>
            <Line name={`Random Forest (AUC ${auc(data.random_forest.roc_auc)})`} data={forest} type="linear" dataKey="tpr" stroke="#16847a" strokeWidth={2.5} dot={false} isAnimationActive={false}/>
            <Line name="Palpite aleatório (AUC 0,5)" data={diagonal} type="linear" dataKey="tpr" stroke="#9e9e9e" strokeDasharray="5 5" dot={false} isAnimationActive={false} legendType="plainline"/>
          </LineChart>
        </ResponsiveContainer>
      </Box> : <Typography color="text.secondary">Curvas ainda não geradas. Execute novamente o treinamento no backend.</Typography>}
      {hasCurves && <Typography variant="body2" sx={{ mt: 1.5, p: 1.25, bgcolor: "#f6f8fb", borderRadius: 1 }}>
        <strong>Leitura:</strong> AUC vai de 0,5 (chute) a 1,0 (perfeito). As duas curvas ficam bem acima do chute; a do Random Forest
        fica mais colada no canto superior esquerdo, ou seja, detecta mais cancelamentos com menos alarmes falsos.
      </Typography>}
    </CardContent></Card>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs:"1fr", md:"repeat(2,1fr)" }, gap: 2.5 }}>
      <Matrix title="Matriz de confusão — Regressão Logística" matrix={data.logistic_regression.confusion_matrix} />
      <Matrix title="Matriz de confusão — Random Forest" matrix={data.random_forest.confusion_matrix} />
    </Box>
  </>;
}
