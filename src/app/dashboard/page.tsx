"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, CircularProgress, Typography, Button } from "@mui/material";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

const fields = [
  { key: "Age Group", title: "Churn por faixa etária" },
  { key: "Complains", title: "Churn por reclamação" },
  { key: "Status", title: "Churn por status" },
];

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
    { title: "Total de clientes", value: data.total_clients.toLocaleString("pt-BR") },
    { title: "Clientes com churn", value: data.churn_clients.toLocaleString("pt-BR") },
    { title: "Clientes sem churn", value: data.retained_clients.toLocaleString("pt-BR") },
    { title: "Taxa de churn", value: (data.churn_rate * 100).toFixed(1) + "%" },
  ] : [];

  return (
    <>
      <PageHeader eyebrow="VISÃO GERAL" title="Dashboard" description="Indicadores calculados pelo backend a partir dos registros únicos da base Iranian Churn." />
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error} <Button size="small" onClick={() => void load()}>Tentar novamente</Button></Alert>}
      {loading && <Box display="flex" gap={2} alignItems="center" mb={3}><CircularProgress size={22} />Carregando dados reais...</Box>}
      {data && <>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }, gap: 2.5, mb: 3 }}>
          {stats.map(stat => <Card key={stat.title}><CardContent><Typography color="text.secondary" variant="body2">{stat.title}</Typography><Typography variant="h4" fontWeight={700}>{stat.value}</Typography></CardContent></Card>)}
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, gap: 2.5 }}>
          {fields.map(field => {
            const chartData = (data.distributions[field.key] || []).map(row => ({
              label: String(row.value), "Clientes com churn": row.churn, "Sem churn": row.total - row.churn,
            }));
            return <Card key={field.key}><CardContent>
              <Typography variant="h6" mb={2}>{field.title}</Typography>
              <Box sx={{ width: "100%", height: 270 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" /><YAxis allowDecimals={false} />
                    <Tooltip /><Bar dataKey="Clientes com churn" fill="#c65e55" stackId="a" />
                    <Bar dataKey="Sem churn" fill="#367c9b" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent></Card>;
          })}
        </Box>
      </>}
    </>
  );
}
