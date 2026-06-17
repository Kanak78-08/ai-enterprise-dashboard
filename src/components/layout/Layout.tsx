import type { ReactNode } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  children: ReactNode;
}

export default function Layout({ darkMode, setDarkMode, children }: LayoutProps) {
  const bgColor = darkMode ? "#0a0a0a" : "#f5f7fc";
  const textColor = darkMode ? "#fff" : "#1a1a1a";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
