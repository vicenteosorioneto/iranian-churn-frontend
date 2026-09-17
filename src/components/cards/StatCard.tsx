import type { SvgIconComponent } from "@mui/icons-material";
import { Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  helper: string;
  icon: SvgIconComponent;
  value?: string | number | null;
}

export function StatCard({ title, helper, icon: Icon, value }: StatCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
            {value === undefined || value === null ? (
              <Skeleton variant="text" width={88} height={48} sx={{ my: 0.25 }} />
            ) : (
              <Typography variant="h4" mt={1}>{value}</Typography>
            )}
            <Typography variant="caption" color="text.secondary">{helper}</Typography>
          </Box>
          <Box sx={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 2.5, bgcolor: "primary.light", color: "primary.main" }}>
            <Icon />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
