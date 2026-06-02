// Auth types
export interface User {
  email: string;
  id?: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard types
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

export interface AnalyticsCard {
  id: string;
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  color: string;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  status: "Completed" | "Pending" | "Failed";
  timestamp?: string;
}

export interface ChartData {
  name: string;
  reports?: number;
  users?: number;
  revenue?: number;
  analytics?: number;
}

// Widget state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface WidgetState<T> extends LoadingState {
  data: T;
}

// Common component props
export interface BaseWidgetProps {
  darkMode?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface KpiData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend: string;
}

export interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp?: string;
}

export interface Insight {
  id: number;
  text: string;
  metric?: string;
  change?: string;
}
