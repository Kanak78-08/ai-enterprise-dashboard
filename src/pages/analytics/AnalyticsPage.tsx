import { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import AppDataTable from "../../components/table/AppDataTable";
import type { Column } from "../../components/table/AppDataTable";
import FilterDropdown from "../../components/common/FilterDropdown";
import { analyticsService } from "../../services/analyticsService";
import type { AnalyticsData } from "../../types";
import { useTheme } from "@mui/material/styles";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export default function AnalyticsPage() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [plantFilter, setPlantFilter] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getAnalyticsData();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch analytics data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchDate = dateFilter ? row.timestamp.startsWith(dateFilter) : true;
      const matchCategory = categoryFilter ? row.category === categoryFilter : true;
      const matchPlant = plantFilter ? row.plant === plantFilter : true;
      return matchDate && matchCategory && matchPlant;
    });
  }, [data, dateFilter, categoryFilter, plantFilter]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ["ID", "Metric", "Value", "Plant", "Pressure", "Efficiency", "Category", "Timestamp"];
    const csvRows = [headers.join(",")];

    filteredData.forEach((row) => {
      const values = [
        row.id,
        `"${row.metric}"`,
        `"${row.value}"`,
        `"${row.plant}"`,
        `"${row.pressure}"`,
        `"${row.efficiency}"`,
        `"${row.category || ""}"`,
        `"${row.timestamp}"`,
      ];
      csvRows.push(values.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "analytics_data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const columns: Column<AnalyticsData>[] = [
    { id: "metric", label: "Metric" },
    { id: "value", label: "Value" },
    { id: "plant", label: "Plant" },
    { id: "pressure", label: "Pressure" },
    { id: "efficiency", label: "Efficiency" },
    { id: "timestamp", label: "Timestamp", render: (r) => new Date(r.timestamp).toLocaleString() },
  ];

  // Dummy mini-chart data
  const miniChartData = [
    { value: 40 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 50 }, { value: 90 }, { value: 70 }
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Analytics Data View</Typography>
          <Typography variant="body2" color="text.secondary">Detailed metrics from all plants</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 120, height: 40 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniChartData}>
                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          <Button variant="outlined" color="primary" startIcon={<DownloadIcon />} onClick={handleExportCSV}>
            Export CSV
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          type="date" size="small" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }} label="Date" sx={{ minWidth: 150 }}
        />
        <FilterDropdown
          label="Category" value={categoryFilter} onChange={setCategoryFilter} darkMode={darkMode}
          options={[{ label: "Operations", value: "Operations" }, { label: "Maintenance", value: "Maintenance" }]}
        />
        <FilterDropdown
          label="Plant" value={plantFilter} onChange={setPlantFilter} darkMode={darkMode}
          options={[{ label: "Gurgaon", value: "Gurgaon" }, { label: "Pune", value: "Pune" }]}
        />
      </Box>

      <AppDataTable columns={columns} data={filteredData} loading={loading} clientPagination darkMode={darkMode} />
    </Box>
  );
}
