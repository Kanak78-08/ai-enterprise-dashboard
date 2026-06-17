import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as UsersIcon,
  ShowChart as RevenueIcon,
  Assignment as ReportsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { KpiCard } from "../../components/dashboard/KpiCard";
import { ChartCard } from "../../components/dashboard/ChartCard";
import { ActivityWidget } from "../../components/dashboard/ActivityWidget";
import { dashboardService } from "../../services/dashboardService";
import type { Activity, ChartData } from "../../types";
import type { DashboardStats } from "../../services/dashboardService";


interface DashboardProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

function Dashboard({ darkMode }: DashboardProps) {
  // Loading states for each section
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Error states for each section
  const [statsError, setStatsError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Fetch individual sections
  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await dashboardService.getDashboardStats();
      setDashboardStats(data);
    } catch (error) {
      setStatsError("Failed to load dashboard statistics");
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchChartData = useCallback(async () => {
    setChartLoading(true);
    setChartError(null);
    try {
      const data = await dashboardService.getChartData();
      setChartData(data);
    } catch (error) {
      setChartError("Failed to load chart data");
      console.error("Error fetching chart:", error);
    } finally {
      setChartLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    try {
      const data = await dashboardService.getActivities();
      setActivities(data);
    } catch (error) {
      setActivitiesError("Failed to load activities");
      console.error("Error fetching activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchChartData(),
        fetchActivities(),
      ]);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(() => {
    fetchDashboardStats();
    fetchChartData();
    fetchActivities();
  }, [
    fetchDashboardStats,
    fetchChartData,
    fetchActivities,
  ]);

  // KPI cards configuration
  const kpiCards = [
    {
      title: "Total Reports",
      value: dashboardStats?.totalReports || "0",
      icon: <UsersIcon sx={{ color: "#5844FF", fontSize: 24 }} />,
      color: "#5844FF",
      bgColor: "rgba(88, 68, 255, 0.1)",
      trend: "+12%",
    },
    {
      title: "Completed Reports",
      value: dashboardStats?.completedReports || "0",
      icon: <TrendingUpIcon sx={{ color: "#10B981", fontSize: 24 }} />,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      trend: "+5%",
    },
    {
      title: "Pending Reports",
      value: dashboardStats?.pendingReports || "0",
      icon: <RevenueIcon sx={{ color: "#F59E0B", fontSize: 24 }} />,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
      trend: "+18%",
    },
    {
      title: "Failure Rate",
      value: dashboardStats?.failureRate || "0%",
      icon: <ReportsIcon sx={{ color: "#EF4444", fontSize: 24 }} />,
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      trend: "-8%",
    },
  ];

  return (
    <Container maxWidth="lg" disableGutters>
      {/* Page Header with Refresh */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: darkMode ? "#fff" : "#1a1a1a",
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: darkMode ? "#9CA3AF" : "#6B7280",
            }}
          >
            Here's what's happening with your business today
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={refreshAllData}
          sx={{
            textTransform: "none",
            color: "#5844FF",
            borderColor: "#5844FF",
            "&:hover": {
              backgroundColor: "rgba(88, 68, 255, 0.1)",
            },
          }}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert if any global errors */}
      {statsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {statsError}
        </Alert>
      )}

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {kpiCards.map((card, idx) => (
          <KpiCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            trend={card.trend}
            loading={statsLoading}
            darkMode={darkMode}
          />
        ))}
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Line Chart */}
        <ChartCard
          title="Reports Trend 📈"
          loading={chartLoading}
          error={chartError || undefined}
          onRetry={fetchChartData}
          darkMode={darkMode}
          height="350px"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#333" : "#e0e0e0"}
              />
              <XAxis
                dataKey="name"
                stroke={darkMode ? "#666" : "#999"}
              />
              <YAxis stroke={darkMode ? "#666" : "#999"} />
              <Tooltip
                contentStyle={{
                  background: darkMode ? "#1e1e1e" : "white",
                  border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                  borderRadius: 8,
                }}
                labelStyle={{ color: darkMode ? "#fff" : "#1a1a1a" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#5844FF"
                strokeWidth={2}
                dot={{ fill: "#5844FF", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard
          title="Performance Metrics 📊"
          loading={chartLoading}
          error={chartError || undefined}
          onRetry={fetchChartData}
          darkMode={darkMode}
          height="350px"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#333" : "#e0e0e0"}
              />
              <XAxis
                dataKey="name"
                stroke={darkMode ? "#666" : "#999"}
              />
              <YAxis stroke={darkMode ? "#666" : "#999"} />
              <Tooltip
                contentStyle={{
                  background: darkMode ? "#1e1e1e" : "white",
                  border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                  borderRadius: 8,
                }}
                labelStyle={{ color: darkMode ? "#fff" : "#1a1a1a" }}
              />
              <Legend />
              <Bar
                dataKey="users"
                fill="#5844FF"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* Bottom Widgets Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Recent Activities */}
        <ActivityWidget
          activities={activities}
          loading={activitiesLoading}
          error={activitiesError || undefined}
          onRetry={fetchActivities}
          darkMode={darkMode}
        />
      </Box>
    </Container>
  );
}

export default Dashboard;