import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { loginSuccess } from "../../redux/auth/authSlice";
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
  IconButton,
  InputAdornment,
  Container,
  Card,
  CardContent,
  Link,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  MailOutlined,
} from "@mui/icons-material";


// Validation schema
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "admin@test.com",
      password: "password123",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      dispatch(loginSuccess(response));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
          pointerEvents: "none",
        },
      }}
    >
      {/* Decorative wave pattern */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "40%",
          height: "100%",
          background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1440 320\"><path fill=\"rgba(88,68,255,0.1)\" d=\"M0,96L120,112C240,128,480,160,720,160C960,160,1200,128,1320,112L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z\"></path></svg>')",
          backgroundSize: "cover",
          backgroundPosition: "left",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

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
          <CardContent
            sx={{
              p: { xs: 3, sm: 4 },
              background: "#ffffff",
            }}
          >
            {/* Header */}
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
                  boxShadow: "0 4px 12px rgba(88, 68, 255, 0.3)",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  A
                </Typography>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: "#1a1a1a",
                  fontSize: "1.5rem",
                }}
              >
                AnalyticsPro
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, fontSize: "0.9rem" }}
              >
                AI-Powered Enterprise Dashboard
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 1.5 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {/* Welcome Message */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: "#1a1a1a",
                  fontSize: "1.1rem",
                }}
              >
                Welcome Back 👋
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.9rem" }}
              >
                Sign in to continue to your account
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email address"
                    type="email"
                    variant="outlined"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlined sx={{ color: "#5844FF", mr: 1, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        "&:hover fieldset": {
                          borderColor: "#e0e0e0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#5844FF",
                        },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: "#5844FF", mr: 1, fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="small"
                              sx={{
                                color: "#5844FF",
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ fontSize: 20 }} />
                              ) : (
                                <Visibility sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        "&:hover fieldset": {
                          borderColor: "#e0e0e0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#5844FF",
                        },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                )}
              />

              {/* Remember Me & Forgot Password */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        color: "#5844FF",
                        "&.Mui-checked": {
                          color: "#5844FF",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  href="#"
                  sx={{
                    fontSize: "0.9rem",
                    color: "#5844FF",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* Submit Button */}
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
                  fontSize: "1rem",
                  mb: 3,
                  position: "relative",
                  boxShadow: "0 4px 12px rgba(88, 68, 255, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #3f2aff 0%, #5e4dd8 100%)",
                    boxShadow: "0 6px 16px rgba(88, 68, 255, 0.4)",
                  },
                  "&:disabled": {
                    opacity: 0.7,
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                        mr: 1,
                        position: "absolute",
                        left: 20,
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider with text */}
              <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Divider sx={{ flex: 1, backgroundColor: "#e0e0e0" }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  or continue with
                </Typography>
                <Divider sx={{ flex: 1, backgroundColor: "#e0e0e0" }} />
              </Box>

              {/* Social Login Buttons */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#1a1a1a",
                    fontWeight: 500,
                    py: 1.2,
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#5844FF",
                      backgroundColor: "rgba(88, 68, 255, 0.04)",
                    },
                  }}
                >
                  <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjIuNTYgMTIuMjVjMCAwuOTItLjA4IDEuNzktLjIyIDIuNjRIMTJWMTkuMjZoNi4xYzEuOS0xLjc2IDMuMDAtNC40NiAzLjAwLTcuNzZWMTIuMjV6IiBmaWxsPSIjNDI4NUY0Ii8+PHBhdGggZD0iTTExLjk3IDIyLjk3YzIuNzEgMCA0Ljk4LTAuOSA2LjY0LTIuNDVsLTMuMTUtMi40NWMtMC45IDAuNi0yLjA1IDAuOTYtMy40OSAwLjk2LTIuNjggMC00Ljk1LTEuOC01Ljc1LTQuMjJIMi45OHYyLjUyQzMuODkgMjAuMjYgNy41NCAyMi45NyAxMS45NyAyMi45N3oiIGZpbGw9IiMzNEE4NTMiLz48cGF0aCBkPSJNNS4zIDcuNDhjLTAuNzItMC42LTEuMi0xLjQzLTEuMi0yLjQ4UzQuNTggMy41NiA1LjMgMi45NkwyLjE1LTAuMjJDMC41NCAyLjEgLTAuNjEgNS4xMiAwLjQ4IDcuODVMMi4zIDkuNjZDMy43IDcuNjkgNi44IDUuMDYgNS4zIDcuNDh6IiBmaWxsPSIjRkJCQzA0Ii8+PHBhdGggZD0iTTExLjk3IDUuMzZjMS45NiAwIDMuNzMgMC42NyA1LjExIDEuOTZsMy44Mi0zLjgyQzE2LjUgMS4wMyAxNC4yNiAwIDExLjk3IDBDNy41NCAwIDMuODkgMi43MSAyLjk4IDYuNzRMNS4zIDkuMjZDNi4yIDcuMTYgOC42NyA1LjM2IDExLjk3IDUuMzZ6IiBmaWxsPSIjRUE0MzM1Ii8+PC9zdmc+"
                      alt="Google"
                      style={{ width: 20, height: 20 }}
                    />
                    Google
                  </Box>
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#1a1a1a",
                    fontWeight: 500,
                    py: 1.2,
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#5844FF",
                      backgroundColor: "rgba(88, 68, 255, 0.04)",
                    },
                  }}
                >
                  <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkuNSAxMEM4LjkgNCAyLjUgNCAxLjUgMTBjMCA2IDYuNCA2IDE4IDEwIiBmaWxsPSIjMDA0NSBCRCIvPjwvc3ZnPg=="
                      alt="Microsoft"
                      style={{ width: 20, height: 20 }}
                    />
                    Microsoft
                  </Box>
                </Button>
              </Box>

              {/* Sign Up Link */}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  fontSize: "0.9rem",
                }}
              >
                Don't have an account?{" "}
                <Link
                  href="#"
                  sx={{
                    color: "#5844FF",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </form>

            {/* Footer */}
            <Typography
              variant="caption"
              sx={{
                textAlign: "center",
                display: "block",
                color: "#999",
                mt: 4,
                fontSize: "0.8rem",
              }}
            >
              © 2024 AnalyticsPro. All rights reserved
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;