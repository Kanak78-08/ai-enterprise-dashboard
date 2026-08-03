import React, { useState } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
      {/* @ts-ignore */}
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Ask the AI Assistant..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        variant="outlined"
        {...({ InputProps: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!text.trim() || disabled}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: { borderRadius: 3 }
        }} as any)}
      />
    </Box>
  );
};

export default ChatInput;
