import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BarChart as ReportsIcon,
  Analytics as AnalyticsIcon,
  SmartToy as AIIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/auth/authSlice";

interface SidebarProps {
  darkMode: boolean;
}

const menuItems = [
  { label: "Dashboard", icon: DashboardIcon, path: "/dashboard", roles: ["Admin", "Analyst", "Viewer"] },
  { label: "Reports", icon: ReportsIcon, path: "/reports", roles: ["Admin", "Analyst"] },
  { label: "Analytics", icon: AnalyticsIcon, path: "/analytics", roles: ["Admin", "Analyst", "Viewer"] },
  { label: "AI Assistant", icon: AIIcon, path: "/ai-assistant", roles: ["Admin", "Analyst"] },
  { label: "Users", icon: UsersIcon, path: "/users", roles: ["Admin"] },
  { label: "Settings", icon: SettingsIcon, path: "/settings", roles: ["Admin"] },
];

function Sidebar({ darkMode }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: darkMode ? "#1e1e1e" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          borderBottom: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
        }}
        onClick={() => handleNavigate("/dashboard")}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "1.2rem",
          }}
        >
          A
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0,
            }}
          >
            Analytics
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#999",
              mt: -0.5,
            }}
          >
            Pro
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List
        sx={{
          flex: 1,
          py: 2,
          px: 1,
        }}
      >
        {menuItems.filter(item => item.roles.includes(role || "Viewer")).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <ListItem
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 1.5,
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: isActive
                  ? "rgba(88, 68, 255, 0.15)"
                  : "transparent",
                color: isActive ? "#5844FF" : darkMode ? "#ccc" : "#666",
                "&:hover": {
                  backgroundColor: darkMode
                    ? "rgba(88, 68, 255, 0.1)"
                    : "rgba(88, 68, 255, 0.08)",
                  color: "#5844FF",
                },
                pl: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 40,
                }}
              >
                <Icon />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </Box>
              {isActive && (
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: "2px",
                    background:
                      "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                    ml: 1,
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Footer Section */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${darkMode ? "#333" : "#e0e0e0"}`,
          mt: "auto",
        }}
      >
        <Divider sx={{ mb: 2, opacity: 0.3 }} />
        <ListItem
          onClick={handleLogout}
          sx={{
            borderRadius: 1.5,
            cursor: "pointer",
            transition: "all 0.3s ease",
            color: "#ff6b6b",
            "&:hover": {
              backgroundColor: "rgba(255, 107, 107, 0.1)",
            },
            pl: 2,
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: 500,
              },
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: darkMode ? "#1e1e1e" : "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1001,
              }}
            >
              <CloseIcon />
            </IconButton>
            {sidebarContent}
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <Box
      sx={{
        width: 250,
        flexShrink: 0,
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      }}
    >
      {sidebarContent}
    </Box>
  );
}

export default Sidebar;