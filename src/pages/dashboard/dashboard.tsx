import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as UsersIcon,
  ShowChart as RevenueIcon,
  Assignment as ReportsIcon,
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
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { dashboardService } from "../../services/dashboardService";
import type { Activity, ChartData } from "../../types";

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

function Dashboard({ darkMode, setDarkMode }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalUsers: string | number;
    activeUsers: string | number;
    totalRevenue: string;
    conversionRate: string;
  }>({
    totalUsers: "1,234",
    activeUsers: "856",
    totalRevenue: "$125,430",
    conversionRate: "3.24%",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [chartDataRes, activitiesRes, analyticsRes] = await Promise.all([
          dashboardService.getChartData(),
          dashboardService.getActivities(),
          dashboardService.getAnalytics(),
        ]);

        setChartData(chartDataRes);
        setActivities(activitiesRes);
        setAnalytics(analyticsRes);
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
      value: analytics.totalUsers,
      icon: UsersIcon,
      color: "#5844FF",
      bgColor: "rgba(88, 68, 255, 0.1)",
      trend: "+12%",
    },
    {
      title: "Completed Reports",
      value: analytics.activeUsers,
      icon: TrendingUpIcon,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      trend: "+5%",
    },
    {
      title: "Pending Reports",
      value: analytics.totalRevenue,
      icon: RevenueIcon,
      color: "#F59E0B",
      bgColor: "rgba(245, 158, 11, 0.1)",
      trend: "+18%",
    },
    {
      title: "Failed Reports",
      value: "92",
      icon: ReportsIcon,
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
      trend: "+8%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "error";
      default:
        return "default";
    }
  };

  const bgColor = darkMode ? "#0a0a0a" : "#f5f7fc";
  const cardBg = darkMode ? "#1a1a1a" : "white";
  const textColor = darkMode ? "#fff" : "#1a1a1a";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" disableGutters>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: textColor,
                }}
              >
                Welcome Back! 
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#999",
                }}
              >
                Here's what's happening with your business today
              </Typography>
            </Box>

            {/* Analytics Cards */}
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
              {analyticsCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card key={idx}
                      sx={{
                        background: cardBg,
                        border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                        borderRadius: 2,
                        p: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 16px ${
                            darkMode
                              ? "rgba(0,0,0,0.3)"
                              : "rgba(0,0,0,0.1)"
                          }`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 1.5,
                            background: card.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon sx={{ color: card.color, fontSize: 28 }} />
                        </Box>
                        <Chip
                          label={card.trend}
                          size="small"
                          sx={{
                            background: card.bgColor,
                            color: card.color,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#999",
                          mb: 0.5,
                          fontWeight: 500,
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: textColor,
                        }}
                      >
                        {card.value}
                      </Typography>
                    </Card>
                );
              })}
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
              <Card
                  sx={{
                    background: cardBg,
                    border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                    borderRadius: 2,
                    p: 2.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: textColor,
                    }}
                  >
                    Reports Trend 📈
                  </Typography>
                  {loading ? (
                    <Box
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
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
                            border: `1px solid ${
                              darkMode ? "#333" : "#e0e0e0"
                            }`,
                            borderRadius: 8,
                          }}
                          labelStyle={{ color: textColor }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="reports"
                          stroke="#5844FF"
                          strokeWidth={3}
                          dot={{ fill: "#5844FF", r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Card>

              {/* Bar Chart */}
              <Card
                  sx={{
                    background: cardBg,
                    border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                    borderRadius: 2,
                    p: 2.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: textColor,
                    }}
                  >
                    Performance Metrics 📊
                  </Typography>
                  {loading ? (
                    <Box
                      sx={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
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
                            border: `1px solid ${
                              darkMode ? "#333" : "#e0e0e0"
                            }`,
                            borderRadius: 8,
                          }}
                          labelStyle={{ color: textColor }}
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
                  )}
                </Card>
            </Box>

            {/* Recent Activities Table */}
            <Card
              sx={{
                background: cardBg,
                border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                borderRadius: 2,
                p: 2.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: textColor,
                }}
              >
                Recent Activities 📋
              </Typography>

              {loading ? (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    background: darkMode ? "#151515" : "#fafafa",
                    border: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
                  }}
                >
                  <Table
                    sx={{
                      "& thead th": {
                        background: darkMode ? "#222" : "#f5f5f5",
                        fontWeight: 700,
                        color: textColor,
                      },
                      "& tbody td": {
                        color: textColor,
                        borderColor: darkMode ? "#333" : "#e0e0e0",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.user}</TableCell>
                          <TableCell>{activity.action}</TableCell>
                          <TableCell>
                            <Chip
                              label={activity.status}
                              size="small"
                              color={getStatusColor(activity.status)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{activity.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;