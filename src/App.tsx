import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ReportsPage from "./pages/reports/ReportsPage";
import UsersPage from "./pages/users/UsersPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AuthProvider>
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
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  {/* Placeholder for Settings */}
                  <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;