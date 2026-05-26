import React from "react";
import { Card, Typography, Box } from "@mui/material";

interface ChartCardProps {
  title: string;
  children?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      <Box>{children}</Box>
    </Card>
  );
};

export default ChartCard;
