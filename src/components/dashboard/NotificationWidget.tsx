import React from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Chip, Avatar } from "@mui/material";
import { WarningAmber as WarningIcon, Notifications as BellIcon, CheckCircle as SuccessIcon } from "@mui/icons-material";
import type { Notification } from "../../types";

const iconFor = (severity: string) => {
  switch (severity) {
    case 'warning': return <WarningIcon />;
    case 'success': return <SuccessIcon />;
    default: return <BellIcon />;
  }
}

const NotificationWidget: React.FC<{ items: Notification[] }> = ({ items }) => {
  return (
    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
      <List>
        {items.map((n) => (
          <ListItem key={n.id} alignItems="flex-start">
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'transparent' }}>{iconFor(n.severity)}</Avatar>
            </ListItemIcon>
            <ListItemText primary={n.title} secondary={n.timestamp} />
            <Chip label={n.severity} size="small" />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotificationWidget;
