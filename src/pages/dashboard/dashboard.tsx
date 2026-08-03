import { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Container, Typography, Alert, Button } from "@mui/material";
import type { DashboardFilters } from "../../types/ai";
import {
  TrendingUp as TrendingUpIcon, People as UsersIcon,
  ShowChart as RevenueIcon, Assignment as ReportsIcon,
  Refresh as RefreshIcon, AutoAwesome as ExplainIcon,
} from "@mui/icons-material";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { ChartCard } from "../../components/dashboard/ChartCard";
import { ActivityWidget } from "../../components/dashboard/ActivityWidget";
import { dashboardService } from "../../services/dashboardService";
import type { Activity, ChartData } from "../../types";
import type { DashboardStats } from "../../services/dashboardService";

// AI Components
import AISearchBar from "../../components/ai/AISearchBar";
import AISummaryCard from "../../components/ai/AISummaryCard";
import AIRecommendations from "../../components/ai/AIRecommendations";
import ExplainChartModal from "../../components/ai/ExplainChartModal";
import ActiveFilters from "../../components/dashboard/ActiveFilters";
import FilterToolbar from "../../components/dashboard/FilterToolbar";
import SavedQueries from "../../components/ai/SavedQueries";
import { useAIDashboard } from "../../hooks/useAIDashboard";
import { useAppSelector } from "../../redux/hooks";

interface DashboardProps { darkMode: boolean; setDarkMode: (value: boolean) => void; }

function Dashboard({ darkMode }: DashboardProps) {
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // AI hooks
  const {
    summary, summaryLoading, generateSummary,
    recommendations, recommendationsLoading, generateRecommendations,
    chartExplanation, chartExplanationLoading, explainModalOpen,
    explainChart, closeExplainModal,
  } = useAIDashboard();

  const { activeFilters } = useAppSelector((s) => s.ai);
  const [explainTitle, setExplainTitle] = useState("");

  const fetchDashboardStats = useCallback(async (filters: DashboardFilters = {}) => {
    setStatsLoading(true); setStatsError(null);
    try { const data = await dashboardService.getDashboardStats(filters); setDashboardStats(data); }
    catch { setStatsError("Failed to load dashboard statistics"); }
    finally { setStatsLoading(false); }
  }, []);

  const fetchChartData = useCallback(async (filters: DashboardFilters = {}) => {
    setChartLoading(true); setChartError(null);
    try {
      const data = await dashboardService.getChartData(filters);
      setChartData(data);
    } catch {
      setChartError("Failed to load chart data");
    } finally {
      setChartLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setActivitiesLoading(true); setActivitiesError(null);
    try { const data = await dashboardService.getActivities(); setActivities(data); }
    catch { setActivitiesError("Failed to load activities"); }
    finally { setActivitiesLoading(false); }
  }, []);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchChartData(activeFilters), fetchActivities()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchDashboardStats(activeFilters);
    fetchChartData(activeFilters);
  }, [activeFilters, fetchDashboardStats, fetchChartData]);

  const refreshAllData = useCallback(() => {
    fetchDashboardStats(activeFilters); fetchChartData(activeFilters); fetchActivities();
  }, [fetchDashboardStats, fetchChartData, fetchActivities, activeFilters]);

  const handleRefreshSummary = useCallback(() => {
    generateSummary(activeFilters);
  }, [activeFilters, generateSummary]);

  const handleRefreshRecommendations = useCallback(() => {
    generateRecommendations(activeFilters);
  }, [activeFilters, generateRecommendations]);

  // Filter KPI cards based on AI filters
  const filteredKpiValues = useMemo(() => {
    if (!dashboardStats) return null;
    // If status filter is active, highlight the matching KPI
    return dashboardStats;
  }, [dashboardStats]);

  const kpiCards = [
    {
      title: "Total Reports", value: filteredKpiValues?.totalReports || "0",
      icon: <UsersIcon sx={{ color: "#5844FF", fontSize: 24 }} />,
      color: "#5844FF", bgColor: "rgba(88, 68, 255, 0.1)", trend: "+12%",
      highlight: !activeFilters.status,
    },
    {
      title: "Completed Reports", value: filteredKpiValues?.completedReports || "0",
      icon: <TrendingUpIcon sx={{ color: "#10B981", fontSize: 24 }} />,
      color: "#10B981", bgColor: "rgba(16, 185, 129, 0.1)", trend: "+5%",
      highlight: activeFilters.status === "Completed",
    },
    {
      title: "Pending Reports", value: filteredKpiValues?.pendingReports || "0",
      icon: <RevenueIcon sx={{ color: "#F59E0B", fontSize: 24 }} />,
      color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.1)", trend: "+18%",
      highlight: activeFilters.status === "Pending",
    },
    {
      title: "Failure Rate", value: filteredKpiValues?.failureRate || "0%",
      icon: <ReportsIcon sx={{ color: "#EF4444", fontSize: 24 }} />,
      color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.1)", trend: "-8%",
      highlight: activeFilters.status === "Failed",
    },
  ];

  return (
    <Container maxWidth="lg" disableGutters>
      {/* Header with AI Search */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: darkMode ? "#fff" : "#1a1a1a" }}>Dashboard</Typography>
          <Typography variant="body2" sx={{ color: darkMode ? "#9CA3AF" : "#6B7280" }}>AI-powered analytics at your fingertips</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AISearchBar darkMode={darkMode} />
          <Button startIcon={<RefreshIcon />} onClick={refreshAllData} sx={{ textTransform: "none", color: "#5844FF", borderColor: "#5844FF", "&:hover": { backgroundColor: "rgba(88, 68, 255, 0.1)" }, minWidth: "auto", whiteSpace: "nowrap" }} variant="outlined">
            Refresh
          </Button>
        </Box>
      </Box>

      {/* AI Active Filters */}
      <Box sx={{ mb: 2 }}><FilterToolbar darkMode={darkMode} /></Box>
      <Box sx={{ mb: 2 }}><ActiveFilters darkMode={darkMode} /></Box>

      {statsError && <Alert severity="error" sx={{ mb: 2 }}>{statsError}</Alert>}

      {/* KPI Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 2, mb: 3 }}>
        {kpiCards.map((card, idx) => (
          <Box key={idx} sx={{
            borderRadius: "12px",
            transition: "all 0.3s ease",
            ...(card.highlight ? {
              ring: "2px solid",
              boxShadow: `0 0 0 2px ${card.color}40`,
              transform: "scale(1.02)",
            } : {}),
          }}>
            <KpiCard title={card.title} value={card.value} icon={card.icon} color={card.color} bgColor={card.bgColor} trend={card.trend} loading={statsLoading} darkMode={darkMode} />
          </Box>
        ))}
      </Box>

      {/* AI Summary Card */}
      <Box sx={{ mb: 3 }}>
        <AISummaryCard summary={summary} loading={summaryLoading} onRefresh={handleRefreshSummary} darkMode={darkMode} />
      </Box>

      {/* Charts + AI Recommendations */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 2, mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Line Chart with Explain */}
          <ChartCard title="Reports Trend 📈" loading={chartLoading} error={chartError || undefined} onRetry={fetchChartData} darkMode={darkMode} height="350px">
            <Box sx={{ position: "relative" }}>
              <Button size="small" startIcon={<ExplainIcon sx={{ fontSize: 16 }} />} onClick={() => { setExplainTitle("Reports Trend"); explainChart({ chartType: "LINE", chartTitle: "Reports Trend", data: chartData as any }); }}
                sx={{ position: "absolute", top: -40, right: 0, zIndex: 10, textTransform: "none", fontSize: "0.75rem", color: "#5844FF", borderColor: "rgba(88,68,255,0.3)", borderRadius: "8px", px: 1.5, py: 0.25, "&:hover": { backgroundColor: "rgba(88,68,255,0.08)" } }} variant="outlined">
                Explain
              </Button>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#e0e0e0"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#666" : "#999"} />
                  <YAxis stroke={darkMode ? "#666" : "#999"} />
                  <Tooltip contentStyle={{ background: darkMode ? "#1e1e1e" : "white", border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`, borderRadius: 8 }} labelStyle={{ color: darkMode ? "#fff" : "#1a1a1a" }} />
                  <Legend />
                  <Line type="monotone" dataKey="reports" stroke="#5844FF" strokeWidth={2} dot={{ fill: "#5844FF", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>

          {/* Bar Chart with Explain */}
          <ChartCard title="Performance Metrics 📊" loading={chartLoading} error={chartError || undefined} onRetry={fetchChartData} darkMode={darkMode} height="350px">
            <Box sx={{ position: "relative" }}>
              <Button size="small" startIcon={<ExplainIcon sx={{ fontSize: 16 }} />} onClick={() => { setExplainTitle("Performance Metrics"); explainChart({ chartType: "BAR", chartTitle: "Performance Metrics", data: chartData as any }); }}
                sx={{ position: "absolute", top: -40, right: 0, zIndex: 10, textTransform: "none", fontSize: "0.75rem", color: "#5844FF", borderColor: "rgba(88,68,255,0.3)", borderRadius: "8px", px: 1.5, py: 0.25, "&:hover": { backgroundColor: "rgba(88,68,255,0.08)" } }} variant="outlined">
                Explain
              </Button>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#e0e0e0"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#666" : "#999"} />
                  <YAxis stroke={darkMode ? "#666" : "#999"} />
                  <Tooltip contentStyle={{ background: darkMode ? "#1e1e1e" : "white", border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`, borderRadius: 8 }} labelStyle={{ color: darkMode ? "#fff" : "#1a1a1a" }} />
                  <Legend />
                  <Bar dataKey="users" fill="#5844FF" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </ChartCard>
        </Box>

        {/* AI Recommendations Sidebar */}
        <AIRecommendations recommendations={recommendations} loading={recommendationsLoading} onRefresh={handleRefreshRecommendations} darkMode={darkMode} />
      </Box>

      {/* Bottom Section: Saved Queries + Activities */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 2, mb: 4 }}>
        <SavedQueries darkMode={darkMode} />
        <ActivityWidget activities={activities} loading={activitiesLoading} error={activitiesError || undefined} onRetry={fetchActivities} darkMode={darkMode} />
      </Box>

      {/* Explain Chart Modal */}
      <ExplainChartModal open={explainModalOpen} onClose={closeExplainModal} explanation={chartExplanation} loading={chartExplanationLoading} chartTitle={explainTitle} darkMode={darkMode} />
    </Container>
  );
}

export default Dashboard;
