"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  AnalyticsOutlined,
  AutoGraphOutlined,
  DashboardOutlined,
  MenuRounded,
  PsychologyOutlined,
  ScienceOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

const drawerWidth = 264;

const navigation = [
  { label: "Visão Geral", href: "/dashboard", icon: DashboardOutlined },
  { label: "Modelos", href: "/models", icon: PsychologyOutlined },
  { label: "Prever Churn", href: "/prediction", icon: AutoGraphOutlined },
  { label: "Análise dos Dados", href: "/analysis", icon: AnalyticsOutlined },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <Stack sx={{ height: "100%", bgcolor: "#102b56", color: "white" }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, height: 72 }}>
        <Avatar variant="rounded" sx={{ width: 38, height: 38, bgcolor: "secondary.main" }}>
          <ScienceOutlined />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={750} lineHeight={1.2}>
            Churn Analytics
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,.65)" }}>
            Iranian Dataset
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "rgba(255,255,255,.10)" }} />
      <List sx={{ px: 1.5, py: 2 }}>
        {navigation.map(({ label, href, icon: Icon }) => {
          const selected = pathname === href;
          return (
            <ListItemButton
              key={href}
              component={Link}
              href={href}
              selected={selected}
              onClick={onNavigate}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: selected ? "white" : "rgba(255,255,255,.72)",
                "&.Mui-selected": { bgcolor: "rgba(255,255,255,.13)" },
                "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,.17)" },
                "&:hover": { bgcolor: "rgba(255,255,255,.08)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}><Icon /></ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: selected ? 650 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ mt: "auto", p: 2.5 }}>
        <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: "rgba(255,255,255,.07)" }}>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,.56)" }}>PROJETO ACADÊMICO</Typography>
          <Typography variant="body2" mt={0.5}>Análise comparativa de modelos de classificação.</Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ minHeight: "72px !important", px: { xs: 2, sm: 3 } }}>
          <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" }, mr: 1 }} aria-label="Abrir menu">
            <MenuRounded />
          </IconButton>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>Plataforma de Churn</Typography>
            <Typography variant="caption" color="text.secondary">Análise e apoio à decisão com Machine Learning</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", sm: "block" }, px: 1.5, py: 0.75, borderRadius: 10, bgcolor: "primary.light", color: "primary.dark" }}>
            <Typography variant="caption" fontWeight={700}>AMBIENTE ACADÊMICO</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth, border: 0 } }}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, border: 0 } }}
        >
          <Sidebar />
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: "72px" }}>
        <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1600, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}
