import React from "react";
import { Box, Typography, Button, OutlinedInput, InputAdornment, Select, MenuItem, FormControl } from "@mui/material";
import { Search as SearchIcon, GetApp as GetAppIcon } from "@mui/icons-material";

const DashboardHeader: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Enterprise Analytics</Typography>
        <Typography variant="body2" color="text.secondary">Overview & performance</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <OutlinedInput
            placeholder="Search reports, users..."
            startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
            sx={{ borderRadius: 2 }}
          />
        </FormControl>

        <Select size="small" defaultValue="7d" sx={{ minWidth: 120 }}>
          <MenuItem value="1d">Last 24h</MenuItem>
          <MenuItem value="7d">Last 7 days</MenuItem>
          <MenuItem value="30d">Last 30 days</MenuItem>
          <MenuItem value="90d">Last 90 days</MenuItem>
        </Select>

        <Button variant="contained" startIcon={<GetAppIcon />}>Generate Report</Button>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
