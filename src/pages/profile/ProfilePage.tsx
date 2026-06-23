import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>User Profile</Typography>
      <Card>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box>
            <Typography variant="h5">{user?.name || "N/A"}</Typography>
            <Typography color="text.secondary">{user?.email || "N/A"}</Typography>
            <Typography sx={{ mt: 1 }}>Role: <strong>{user?.role || "Unknown"}</strong></Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Last Login: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
