import {
  GroupsOutlined,
  PersonOffOutlined,
  PersonOutlined,
  PercentOutlined,
} from "@mui/icons-material";
import { Alert, Box } from "@mui/material";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/cards/StatCard";
import { ChartPlaceholder } from "@/components/charts/ChartPlaceholder";

const stats = [
  { title: "Total de clientes", helper: "Base analisada", icon: GroupsOutlined },
  { title: "Clientes com churn", helper: "Classe positiva", icon: PersonOffOutlined },
  { title: "Clientes sem churn", helper: "Classe negativa", icon: PersonOutlined },
  { title: "Taxa de churn", helper: "Percentual da base", icon: PercentOutlined },
];

const charts = [
  { title: "Distribuição de churn", description: "Proporção entre clientes com e sem churn." },
  { title: "Churn por faixa etária", description: "Comparativo por grupos de idade." },
  { title: "Churn por reclamação", description: "Relação entre reclamações e evasão." },
  { title: "Churn por status", description: "Distribuição de churn por status do cliente." },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader eyebrow="VISÃO GERAL" title="Dashboard" description="Acompanhe os principais indicadores e padrões do conjunto de dados Iranian Churn." />
      <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
        Interface inicial preparada. Os indicadores serão exibidos quando os endpoints analíticos estiverem disponíveis.
      </Alert>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }, gap: 2.5, mb: 2.5 }}>
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, gap: 2.5, mb: 2.5 }}>
        {charts.map((chart) => <ChartPlaceholder key={chart.title} {...chart} />)}
      </Box>
      <ChartPlaceholder title="Importância das variáveis" description="Participação relativa dos atributos nas decisões do modelo." minHeight={300} />
    </>
  );
}
