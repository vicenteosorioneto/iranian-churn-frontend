"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2856a6", dark: "#173a78", light: "#e8effb" },
    secondary: { main: "#16847a" },
    background: { default: "#f5f7fb", paper: "#ffffff" },
    text: { primary: "#172033", secondary: "#667085" },
    divider: "#e5e9f2",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    h4: { fontWeight: 750, letterSpacing: "-0.03em" },
    h5: { fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 650 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { border: "1px solid #e5e9f2", boxShadow: "0 5px 18px rgba(23, 32, 51, 0.04)" },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiFormControl: { defaultProps: { size: "small" } },
  },
});
