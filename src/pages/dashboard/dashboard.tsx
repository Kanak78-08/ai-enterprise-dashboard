import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as UsersIcon,
  ShowChart as RevenueIcon,
  Assignment as ReportsIcon,
} from "@mui/icons-material";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { dashboardService } from "../../services/dashboardService";
import type { Activity, ChartData, DashboardStat } from "../../types";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import KpiCard from "../../components/dashboard/KpiCard";
import ChartCard from "../../components/dashboard/ChartCard";
import ActivityWidget from "../../components/dashboard/ActivityWidget";
import NotificationWidget from "../../components/dashboard/NotificationWidget";
import InsightsWidget from "../../components/dashboard/InsightsWidget";
import LineAnalyticsChart from "../../components/charts/LineAnalyticsChart";
import PieAnalyticsChart from "../../components/charts/PieAnalyticsChart";
import BarAnalyticsChart from "../../components/charts/BarAnalyticsChart";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode, setDarkMode }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStat | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chartDataRes, activitiesRes, statsRes, notificationsRes, insightsRes] = await Promise.all([
          dashboardService.getChartData(),
          dashboardService.getActivities(),
          dashboardService.getDashboardStats(),
          dashboardService.getNotifications(),
          dashboardService.getInsights(),
        ]);

        setChartData(chartDataRes);
        setActivities(activitiesRes);
        setStats(statsRes);
        setNotifications(notificationsRes);
        setInsights(insightsRes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const analyticsCards = [
    {
      title: "Total Reports",
      value: stats ? stats.totalReports : <Skeleton width={80} variant="text" />,
      icon: <UsersIcon sx={{ color: "#5844FF" }} />,
      color: "#5844FF",
      bgColor: "rgba(88, 68, 255, 0.08)",
      trend: "+12%",
    },
    {
      title: "Completed Reports",
      value: stats ? stats.completedReports : <Skeleton width={60} variant="text" />,
      icon: <TrendingUpIcon sx={{ color: "#10B981" }} />,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.08)",
      trend: "+5%",
    },
    {
      title: "Pending Reports",
      value: stats ? stats.pendingReports : <Skeleton width={40} variant="text" />,
      icon: <RevenueIcon sx={{ color: "#F59E0B" }} />,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.08)",
      trend: "+18%",
    },
    {
      title: "Failure Rate",
      value: stats ? `${stats.failureRate}%` : <Skeleton width={40} variant="text" />,
      icon: <ReportsIcon sx={{ color: "#EF4444" }} />,
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.08)",
      trend: "-2%",
    },
  ];

  const bgColor = darkMode ? "#0a0a0a" : "#f5f7fc";
  const textColor = darkMode ? "#fff" : "#1a1a1a";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: bgColor, color: textColor }}>
      <Sidebar darkMode={darkMode} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <Box component="main" sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 3 }, overflow: "auto" }}>
          <Container maxWidth="lg" disableGutters>
            <DashboardHeader />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2, mb: 4 }}>
              {analyticsCards.map((card, idx) => (
                <KpiCard key={idx} title={card.title} value={card.value as any} trend={card.trend} color={card.color} bgColor={card.bgColor} icon={card.icon} />
              ))}
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2, mb: 4 }}>
              <ChartCard title="Reports Overview">
                {loading ? <Skeleton variant="rectangular" height={300} /> : <LineAnalyticsChart data={chartData} />}
              </ChartCard>

              <Box sx={{ display: "grid", gap: 2 }}>
                <ChartCard title="Report Categories">
                  {loading ? (
                    <Skeleton variant="rectangular" height={260} />
                  ) : (
                    <PieAnalyticsChart data={[{ name: "Sales", value: 400 }, { name: "Operations", value: 300 }, { name: "Analytics", value: 300 }, { name: "Maintenance", value: 200 }]} />
                  )}
                </ChartCard>

                <ChartCard title="AI Insights">
                  {loading ? <Skeleton variant="rectangular" height={140} /> : <InsightsWidget items={insights} />}
                </ChartCard>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2 }}>
              <ChartCard title="Performance Overview">
                {loading ? <Skeleton variant="rectangular" height={300} /> : <BarAnalyticsChart data={chartData} />}
              </ChartCard>

              <Box sx={{ display: "grid", gap: 2 }}>
                <ChartCard title="Notifications">
                  {loading ? <Skeleton variant="rectangular" height={140} /> : <NotificationWidget items={notifications} />}
                </ChartCard>

                <ChartCard title="Recent Activities">
                  {loading ? <Skeleton variant="rectangular" height={240} /> : <ActivityWidget items={activities} />}
                </ChartCard>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
