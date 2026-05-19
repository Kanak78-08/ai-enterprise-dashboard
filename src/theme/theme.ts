import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5844FF",
      light: "#7c6fff",
      dark: "#3f2aff",
    },
    secondary: {
      main: "#667eea",
      light: "#8fa3f1",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
    },
    background: {
      default: "#F4F7FE",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(88, 68, 255, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(88, 68, 255, 0.4)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7c6fff",
      light: "#9e8fff",
      dark: "#5844FF",
    },
    secondary: {
      main: "#667eea",
      light: "#8fa3f1",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#CBD5E1",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(124, 111, 255, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(124, 111, 255, 0.4)",
          },
        },
      },
    },
  },
});