import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Button, TextField, Alert } from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().min(6, "Must be at least 6 characters").required("New password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required("Confirm password is required"),
});

interface SettingsPageProps {
  darkMode?: boolean;
  setDarkMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SettingsPage({ darkMode, setDarkMode }: SettingsPageProps) {
  const [emailNotif, setEmailNotif] = useState(() => localStorage.getItem("emailNotif") !== "false");
  const [dashNotif, setDashNotif] = useState(() => localStorage.getItem("dashNotif") !== "false");
  const [msg, setMsg] = useState<{type: "success" | "error", text: string} | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
  });

  const handleEmailNotifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotif(e.target.checked);
    localStorage.setItem("emailNotif", e.target.checked ? "true" : "false");
  };

  const handleDashNotifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDashNotif(e.target.checked);
    localStorage.setItem("dashNotif", e.target.checked ? "true" : "false");
  };

  const onSubmit = () => {
    // Mock changing password
    setMsg({ type: "success", text: "Password updated successfully!" });
    reset();
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Settings</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Theme Preferences</Typography>
          <FormControlLabel 
            control={<Switch checked={!!darkMode} onChange={(e) => setDarkMode && setDarkMode(e.target.checked)} />} 
            label="Dark Mode" 
          />
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Notification Settings</Typography>
          <FormControlLabel 
            control={<Switch checked={emailNotif} onChange={handleEmailNotifChange} />} 
            label="Email Notifications" 
          />
          <br />
          <FormControlLabel 
            control={<Switch checked={dashNotif} onChange={handleDashNotifChange} />} 
            label="Dashboard Notifications" 
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Change Password</Typography>
          {msg && <Alert severity={msg.type} sx={{ mb: 2, maxWidth: 400 }}>{msg.text}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="Current Password" size="small" error={!!errors.currentPassword} helperText={errors.currentPassword?.message} />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="New Password" size="small" error={!!errors.newPassword} helperText={errors.newPassword?.message} />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="password" label="Confirm Password" size="small" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
              )}
            />
            <Button type="submit" variant="contained" color="primary">Update Password</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
