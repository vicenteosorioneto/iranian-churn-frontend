"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, CircularProgress, Typography, Button } from "@mui/material";
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "@/services/api";
import { PageHeader } from "@/components/common/PageHeader";

interface GroupSummary {
  value: number;
  total: number;
  churn: number;
  churn_rate: number;
}

interface AnalyticsSummary {
  total_clients: number;
  churn_clients: number;
  retained_clients: number;
  churn_rate: number;
  distributions: Record<string, GroupSummary[]>;
}

interface ChartRow {
  name: string;
  detail: string;
  rate: number;
  churn: number;
  total: number;
}

// The dataset stores age as one representative value per group (15, 25, 30, 45, 55).
const AGE_BY_GROUP: Record<number, number> = { 1: 15, 2: 25, 3: 30, 4: 45, 5: 55 };

const fields: {
  key: string;
  title: string;
  description: string;
  category: (value: number) => { name: string; detail?: string };
}[] = [
  {
    key: "Age Group",
    title: "Cancelamento por faixa etária",
    description: "A base agrupa os clientes em 5 faixas de idade. Abaixo de cada barra está a idade registrada para a faixa.",
    category: value => ({ name: `Faixa ${value}`, detail: AGE_BY_GROUP[value] ? `${AGE_BY_GROUP[value]} anos` : undefined }),
  },
  {
    key: "Complains",
    title: "Cancelamento por reclamação",
    description: "Compara clientes que registraram alguma reclamação com os que nunca reclamaram.",
    category: value => ({ name: value === 1 ? "Reclamou" : "Não reclamou" }),
  },
  {
    key: "Status",
    title: "Cancelamento por status do cliente",
    description: "Ativo: cliente que continua usando o serviço. Inativo: cliente com uso muito baixo no período.",
    category: value => ({ name: value === 1 ? "Ativo" : value === 2 ? "Inativo" : `Status ${value}` }),
  },
];

const percent = (value: number) => `${(value * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

function takeaway(rows: ChartRow[]): string {
  if (rows.length < 2) return "";
  const sorted = [...rows].sort((a, b) => b.rate - a.rate);
  const high = sorted[0];
  const low = sorted[sorted.length - 1];
  const ratio = low.rate > 0 ? high.rate / low.rate : null;
  const times = ratio && ratio >= 1.5 ? ` — cerca de ${ratio.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} vezes mais` : "";
  return `Maior cancelamento: ${high.name}${high.detail ? ` (${high.detail})` : ""}, com ${percent(high.rate)}. `
    + `Menor: ${low.name}${low.detail ? ` (${low.detail})` : ""}, com ${percent(low.rate)}${times}.`;
}

function CategoryTick({ x, y, payload, rows }: { x?: number | string; y?: number | string; payload?: { value: string }; rows: ChartRow[] }) {
  const row = rows.find(item => item.name === payload?.value);
  return <g transform={`translate(${x ?? 0},${y ?? 0})`}>
    <text dy={14} textAnchor="middle" fontSize={12} fontWeight={600} fill="#333">{payload?.value}</text>
    {row?.detail && <text dy={29} textAnchor="middle" fontSize={11} fill="#666">{row.detail}</text>}
    <text dy={row?.detail ? 43 : 29} textAnchor="middle" fontSize={10} fill="#888">{row ? `${row.total.toLocaleString("pt-BR")} clientes` : ""}</text>
  </g>;
}

function RateTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload: ChartRow }[] }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.25, fontSize: 13 }}>
    <strong>{row.name}{row.detail ? ` (${row.detail})` : ""}</strong><br />
    {row.churn.toLocaleString("pt-BR")} de {row.total.toLocaleString("pt-BR")} clientes cancelaram ({percent(row.rate)})
  </Box>;
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<AnalyticsSummary>("/analytics/summary");
      setData(response.data);
    } catch {
      setData(null);
      setError("Não foi possível obter os indicadores reais. Confira o dataset e se a API está ativa.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const stats = data ? [
    { title: "Total de clientes", value: data.total_clients.toLocaleString("pt-BR"), hint: "Registros únicos da base" },
    { title: "Cancelaram (churn)", value: data.churn_clients.toLocaleString("pt-BR"), hint: "Saíram da operadora" },
    { title: "Permaneceram", value: data.retained_clients.toLocaleString("pt-BR"), hint: "Continuaram clientes" },
    { title: "Taxa de cancelamento", value: percent(data.churn_rate), hint: "Cancelaram ÷ total" },
  ] : [];

  return (
    <>
      <PageHeader eyebrow="VISÃO GERAL" title="Dashboard" description="Indicadores calculados pelo backend a partir dos registros únicos da base Iranian Churn." />
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error} <Button size="small" onClick={() => void load()}>Tentar novamente</Button></Alert>}
      {loading && <Box display="flex" gap={2} alignItems="center" mb={3}><CircularProgress size={22} />Carregando dados reais...</Box>}
      {data && <>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }, gap: 2.5, mb: 3 }}>
          {stats.map(stat => <Card key={stat.title}><CardContent>
            <Typography color="text.secondary" variant="body2">{stat.title}</Typography>
            <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
            <Typography color="text.secondary" variant="caption">{stat.hint}</Typography>
          </CardContent></Card>)}
        </Box>
        <Alert severity="info" variant="outlined" sx={{ mb: 2.5 }}>
          <strong>Como ler os gráficos:</strong> cada barra mostra a porcentagem de clientes daquele grupo que cancelou.
          A linha tracejada é a média geral da base ({percent(data.churn_rate)}). Barra acima da linha = grupo com mais risco que a média.
        </Alert>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, gap: 2.5 }}>
          {fields.map(field => {
            const rows: ChartRow[] = (data.distributions[field.key] || []).map(row => {
              const category = field.category(row.value);
              return { name: category.name, detail: category.detail ?? "", rate: row.churn_rate, churn: row.churn, total: row.total };
            });
            const hasDetail = rows.some(row => row.detail);
            const maxRate = Math.max(data.churn_rate, ...rows.map(row => row.rate));
            const top = Math.min(1, Math.ceil((maxRate + 0.08) * 10) / 10);
            const step = top <= 0.3 ? 0.05 : top <= 0.6 ? 0.1 : 0.2;
            const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, index) => Math.round(index * step * 100) / 100);
            return <Card key={field.key}><CardContent>
              <Typography variant="h6">{field.title}</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>{field.description}</Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows} margin={{ top: 22, right: 16, left: 4, bottom: hasDetail ? 34 : 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" interval={0} tick={props => <CategoryTick {...props} rows={rows} />} />
                    <YAxis domain={[0, top]} ticks={ticks} tickFormatter={value => `${Math.round(value * 100)}%`}
                      label={{ value: "% que cancelou", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12, fill: "#666" } }} />
                    <Tooltip content={props => <RateTooltip active={props.active} payload={props.payload as unknown as readonly { payload: ChartRow }[]} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                    <ReferenceLine y={data.churn_rate} stroke="#555" strokeDasharray="5 4"
                      label={{ value: `média geral ${percent(data.churn_rate)}`, position: "insideTopRight", fontSize: 11, fill: "#555" }} />
                    <Bar dataKey="rate" name="Taxa de cancelamento" fill="#c65e55" radius={[4, 4, 0, 0]} maxBarSize={70} minPointSize={2}>
                      <LabelList dataKey="rate" position="top" formatter={(value: unknown) => typeof value === "number" ? percent(value) : ""} style={{ fontSize: 12, fontWeight: 700 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="body2" sx={{ mt: 1.5, p: 1.25, bgcolor: "#f6f8fb", borderRadius: 1 }}>
                <strong>Leitura:</strong> {takeaway(rows)}
              </Typography>
            </CardContent></Card>;
          })}
        </Box>
      </>}
    </>
  );
}
