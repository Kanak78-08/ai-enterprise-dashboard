import React from "react";
import { Card, Box, Typography, Chip } from "@mui/material";

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  color?: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, color = "#5844FF", bgColor = "rgba(88,68,255,0.08)", icon }) => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        transition: "transform 0.24s ease, box-shadow 0.24s ease",
        '&:hover': { transform: "translateY(-6px)", boxShadow: '0 12px 24px rgba(16,24,40,0.08)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 1.5, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
        </Box>
        {trend && <Chip label={trend} size="small" sx={{ color, background: 'transparent', fontWeight: 700 }} />}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Card>
  );
};

export default KpiCard;
