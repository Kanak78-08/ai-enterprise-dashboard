import React from "react";
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";
import { Timeline as TimelineIcon } from "@mui/icons-material";
import type { Activity } from "../../types";

interface Props { items: Activity[] }

const ActivityWidget: React.FC<Props> = ({ items }) => {
  return (
    <Box sx={{ maxHeight: 360, overflow: 'auto' }}>
      <List>
        {items.map((it) => (
          <ListItem key={it.id} divider>
            <ListItemAvatar>
              <Avatar><TimelineIcon /></Avatar>
            </ListItemAvatar>
            <ListItemText primary={it.action} secondary={<>
              <Typography component="span" variant="body2" color="text.primary">{it.user}</Typography>
              {' — '}{it.timestamp}
            </>} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ActivityWidget;
