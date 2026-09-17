import { BarChartOutlined } from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

interface ChartPlaceholderProps {
  title: string;
  description: string;
  minHeight?: number;
}

export function ChartPlaceholder({ title, description, minHeight = 260 }: ChartPlaceholderProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, height: "100%", "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box>
            <Typography variant="h6" fontSize={16}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>{description}</Typography>
          </Box>
          <Chip label="Aguardando API" size="small" variant="outlined" color="primary" />
        </Stack>
        <Box sx={{ minHeight, mt: 2.5, borderRadius: 2, border: "1px dashed", borderColor: "divider", bgcolor: "#fafbfc", display: "grid", placeItems: "center", textAlign: "center", p: 3 }}>
          <Box>
            <BarChartOutlined sx={{ fontSize: 42, color: "#a8b3c5" }} />
            <Typography variant="body2" color="text.secondary" mt={1}>Visualização disponível após a integração dos dados.</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
