import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

const PROMPTS = [
  "Show dashboard summary",
  "What are today's insights?",
  "Explain failure rate",
  "How many pending reports?",
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelect }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <AutoAwesome fontSize="small" /> Suggested prompts
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {PROMPTS.map((prompt, index) => (
          <Chip
            key={index}
            label={prompt}
            onClick={() => onSelect(prompt)}
            variant="outlined"
            color="primary"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(88, 68, 255, 0.08)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SuggestedPrompts;
