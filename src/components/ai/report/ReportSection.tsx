import { Box, Typography, Divider, useTheme } from "@mui/material";
import type { ReportSection as ReportSectionType } from "../../../types/aiWorkflow";

interface ReportSectionProps {
  section: ReportSectionType;
  index: number;
}

// Simple markdown-like renderer for bold (**text**) and bullets
const renderContent = (content: string) => {
  return content.split("\n").map((line, i) => {
    // Convert **bold** to styled spans
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    const isBullet = line.trimStart().startsWith("•") || line.trimStart().startsWith("-");
    const isNumbered = /^\d+\./.test(line.trimStart());
    return (
      <Typography
        key={i}
        variant="body2"
        sx={{
          mb: 0.5,
          pl: isBullet || isNumbered ? 1 : 0,
          lineHeight: 1.8,
          color: "text.secondary",
        }}
      >
        {rendered}
      </Typography>
    );
  });
};

const sectionColors = [
  "#5844FF", "#00C896", "#FF6B6B", "#FFB347", "#4FC3F7", "#AB47BC",
];

export default function ReportSection({ section, index }: ReportSectionProps) {
  const theme = useTheme();
  const color = sectionColors[index % sectionColors.length];

  return (
    <Box
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.015)",
        borderLeft: `4px solid ${color}`,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: `0 4px 20px ${color}20` },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            color,
          }}
        >
          {index + 1}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color }}>
          {section.title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 1.5, opacity: 0.4 }} />
      <Box>{renderContent(section.content)}</Box>
    </Box>
  );
}
