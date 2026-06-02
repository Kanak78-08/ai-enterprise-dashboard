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
    h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.015em" },
    h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.005em" },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(88, 68, 255, 0.2)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          letterSpacing: "0.02em",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(88, 68, 255, 0.3)",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(88, 68, 255, 0.4)",
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "#5844FF",
            backgroundColor: "rgba(88, 68, 255, 0.05)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "all 0.3s ease",
            "&:hover fieldset": {
              borderColor: "#5844FF",
            },
            "&.Mui-focused fieldset": {
              boxShadow: "0 0 0 3px rgba(88, 68, 255, 0.1)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(88, 68, 255, 0.05)",
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
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
    h1: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.015em" },
    h2: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.005em" },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.24)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: "#1E293B",
          "&:hover": {
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(124, 111, 255, 0.2)",
            borderColor: "rgba(124, 111, 255, 0.3)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          letterSpacing: "0.02em",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(124, 111, 255, 0.3)",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(124, 111, 255, 0.4), 0 0 20px rgba(124, 111, 255, 0.2)",
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          transition: "all 0.3s ease",
          borderColor: "rgba(124, 111, 255, 0.5)",
          "&:hover": {
            borderColor: "#7c6fff",
            backgroundColor: "rgba(124, 111, 255, 0.1)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            transition: "all 0.3s ease",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            "&:hover fieldset": {
              borderColor: "#7c6fff",
            },
            "&.Mui-focused fieldset": {
              boxShadow: "0 0 0 3px rgba(124, 111, 255, 0.2)",
              borderColor: "#7c6fff",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(124, 111, 255, 0.3)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(124, 111, 255, 0.1)",
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});