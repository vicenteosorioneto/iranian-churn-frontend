import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2} mb={3}>
      <Box>
        {eyebrow && <Typography variant="overline" color="primary" fontWeight={750}>{eyebrow}</Typography>}
        <Typography component="h1" variant="h4" sx={{ fontSize: { xs: 28, sm: 34 } }}>{title}</Typography>
        <Typography color="text.secondary" mt={0.75} maxWidth={720}>{description}</Typography>
      </Box>
      {action}
    </Stack>
  );
}
