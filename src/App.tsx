import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/" element={<Login />} />

          {/* Dashboard Route - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          {/* Reports Route - Placeholder */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          {/* Analytics Route - Placeholder */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          {/* AI Assistant Route - Placeholder */}
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          {/* Users Route - Placeholder */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

          {/* Settings Route - Placeholder */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
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