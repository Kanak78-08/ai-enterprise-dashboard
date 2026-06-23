import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";
import Layout from "./components/layout/Layout";
import ReportsPage from "./pages/reports/ReportsPage";
import UsersPage from "./pages/users/UsersPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import { useAppDispatch } from "./redux/hooks";
import { restoreSession } from "./redux/auth/authSlice";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(restoreSession({ token, user }));
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, [dispatch]);

  return (
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes inside Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <AnalyticsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  {/* Placeholder for AI Assistant */}
                  <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["Admin"]}>
                  <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <UsersPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["Admin"]}>
                  <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <SettingsPage />
                  </Layout>
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;