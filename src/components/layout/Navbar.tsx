import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../contexts/useAuth";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

function Navbar({ darkMode, onToggleDarkMode }: NavbarProps) {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
    null
  );
  const [anchorElNotif, setAnchorElNotif] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleNotifMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setAnchorElNotif(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const unreadNotifications = 3;

  return (
    <AppBar
      position="static"
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        color: darkMode ? "white" : "#1a1a1a",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Left Side - Title & Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* Right Side - Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Theme Toggle */}
          <IconButton
            onClick={onToggleDarkMode}
            sx={{
              color: "inherit",
              transition: "all 0.3s ease",
              "&:hover": {
                background: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            }}
            title="Toggle dark mode"
          >
            {darkMode ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>

          {/* Notifications */}
          <IconButton
            onClick={handleNotifMenuOpen}
            sx={{
              color: "inherit",
              transition: "all 0.3s ease",
              "&:hover": {
                background: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            }}
          >
            <Badge
              badgeContent={unreadNotifications}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  background: "#ff6b6b",
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Notifications Menu */}
          <Menu
            anchorEl={anchorElNotif}
            open={Boolean(anchorElNotif)}
            onClose={handleNotifMenuClose}
            slotProps={{
              paper: {
                sx: {
                  background: darkMode ? "#1e1e1e" : "white",
                  color: darkMode ? "white" : "black",
                  minWidth: 300,
                },
              },
            }}
          >
            <MenuItem sx={{ fontWeight: 600, cursor: "default" }}>
              Notifications
            </MenuItem>
            <Divider />
            <MenuItem>New report generated</MenuItem>
            <MenuItem>User activity detected</MenuItem>
            <MenuItem>System update available</MenuItem>
            <Divider />
            <MenuItem
              sx={{
                textAlign: "center",
                color: "#5844FF",
                fontWeight: 600,
              }}
            >
              View All
            </MenuItem>
          </Menu>

          {/* User Profile */}
          <Box
            onClick={handleProfileMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              transition: "all 0.3s ease",
              p: 0.5,
              borderRadius: 1,
              "&:hover": {
                background: darkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background:
                  "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                fontSize: "1rem",
                fontWeight: 700,
              }}
            >
              {userInitial}
            </Avatar>
            {!isMobile && (
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {userName}
              </Typography>
            )}
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorElProfile}
            open={Boolean(anchorElProfile)}
            onClose={handleProfileMenuClose}
            slotProps={{
              paper: {
                sx: {
                  background: darkMode ? "#1e1e1e" : "white",
                  color: darkMode ? "white" : "black",
                  minWidth: 250,
                },
              },
            }}
          >
            <MenuItem sx={{ fontWeight: 600, cursor: "default" }}>
              <Avatar
                sx={{
                  mr: 2,
                  background:
                    "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                  fontWeight: 700,
                }}
              >
                {userInitial}
              </Avatar>
              {userName}
            </MenuItem>
            <MenuItem
              sx={{
                fontSize: "0.85rem",
                color: "#999",
                cursor: "default",
              }}
            >
              {user?.email}
            </MenuItem>
            <Divider />
            <MenuItem
              sx={{
                "&:hover": {
                  background: darkMode
                    ? "rgba(88, 68, 255, 0.1)"
                    : "rgba(88, 68, 255, 0.08)",
                },
              }}
            >
              <AccountIcon sx={{ mr: 1.5 }} /> My Profile
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": {
                  background: darkMode
                    ? "rgba(88, 68, 255, 0.1)"
                    : "rgba(88, 68, 255, 0.08)",
                },
              }}
            >
              <SettingsIcon sx={{ mr: 1.5 }} /> Settings
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#ff6b6b",
                fontWeight: 600,
                "&:hover": {
                  background: "rgba(255, 107, 107, 0.1)",
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;