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
