import { Chip } from "@mui/material";
import React from "react";

type ChipProps = React.ComponentProps<typeof Chip>;

interface StatusChipProps extends ChipProps {
  status: string;
}

export default function StatusChip({ status, ...props }: StatusChipProps) {
  let color: "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success" = "default";
  
  const statusLower = status.toLowerCase();
  if (statusLower === "completed" || statusLower === "active") color = "success";
  else if (statusLower === "pending") color = "warning";
  else if (statusLower === "failed" || statusLower === "inactive") color = "error";
  else if (statusLower === "admin") color = "primary";
  else if (statusLower === "analyst") color = "info";

  return <Chip label={status} color={color} size="small" {...props} />;
}
