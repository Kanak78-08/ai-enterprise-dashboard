import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Button, TextField } from "@mui/material";

export default function SettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Settings</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Theme Preferences</Typography>
          <FormControlLabel control={<Switch />} label="Dark Mode" />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Notification Settings</Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
          <br />
          <FormControlLabel control={<Switch defaultChecked />} label="Dashboard Notifications" />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
            <TextField type="password" label="Current Password" size="small" />
            <TextField type="password" label="New Password" size="small" />
            <TextField type="password" label="Confirm Password" size="small" />
            <Button variant="contained" color="primary">Update Password</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
