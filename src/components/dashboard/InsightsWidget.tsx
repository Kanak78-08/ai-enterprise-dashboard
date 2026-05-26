import React from "react";
import { Box, Card, Typography, Button, Divider } from "@mui/material";
import type { Insight } from "../../types";

const InsightsWidget: React.FC<{ items: Insight[] }> = ({ items }) => {
  return (
    <Card sx={{ p: 2.5, borderRadius: 2, background: 'linear-gradient(135deg, rgba(88,68,255,0.08), rgba(16,185,129,0.04))' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <div>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Insights</Typography>
          <Typography variant="body2" color="text.secondary">Automated observations from the analytics engine</Typography>
        </div>
        <Button variant="contained">Ask AI Assistant</Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'grid', gap: 1 }}>
        {items.map((it) => (
          <Box key={it.id} sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{it.title}</Typography>
            <Typography variant="body2" color="text.secondary">{it.summary}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default InsightsWidget;
