import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ErrorOutlined as ErrorIcon } from "@mui/icons-material";

function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center" }}>
          {/* 404 Icon */}
          <Box
            sx={{
              mb: 3,
              animation: "bounce 2s infinite",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-20px)" },
              },
            }}
          >
            <ErrorIcon
              sx={{
                fontSize: { xs: "6rem", sm: "8rem" },
                color: "rgba(255,255,255,0.9)",
              }}
            />
          </Box>

          {/* Error Code */}
          <Typography
            variant={isMobile ? "h3" : "h1"}
            sx={{
              fontWeight: 900,
              color: "white",
              mb: 1,
              textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            404
          </Typography>

          {/* Error Title */}
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          {/* Error Description */}
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 4,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/dashboard")}
              sx={{
                background: "white",
                color: "#667eea",
                fontWeight: 700,
                "&:hover": {
                  background: "rgba(255,255,255,0.9)",
                },
              }}
            >
              Go to Dashboard
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Go Back
            </Button>
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.7)",
              }}
            >
              © 2024 Enterprise Dashboard. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default NotFound;
