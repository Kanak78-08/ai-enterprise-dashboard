import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  Container,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { MailOutlined } from "@mui/icons-material";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: any) => {
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword(data.email);
      setSuccessMsg(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
        py: 2,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(88, 68, 255, 0.08) 0%, rgba(124, 111, 255, 0.05) 100%)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          elevation={3}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 }, background: "#ffffff" }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Typography sx={{ color: "white", fontSize: "1.5rem", fontWeight: 700 }}>A</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: "#1a1a1a", fontSize: "1.5rem" }}>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: "0.9rem" }}>
                Enter your email to receive a password reset link
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            {successMsg && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }}>
                {successMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  // @ts-ignore
                  <TextField
                    {...field}
                    fullWidth
                    label="Email address"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...({ InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlined sx={{ color: "#5844FF", mr: 1, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }} as any)}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  background: "linear-gradient(135deg, #5844FF 0%, #7c6fff 100%)",
                  color: "white",
                  fontWeight: 600,
                  py: 1.3,
                  borderRadius: "8px",
                  textTransform: "none",
                  mb: 3,
                }}
              >
                {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Reset Password"}
              </Button>
            </form>

            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              Remembered your password?{" "}
              <Link component={RouterLink} to="/" sx={{ color: "#5844FF", textDecoration: "none", fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
