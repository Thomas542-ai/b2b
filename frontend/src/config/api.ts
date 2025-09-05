export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api'),
  RATE_LIMIT: {
    MAX_REQUESTS: 100, // Maximum requests per window
    WINDOW_MS: 60000,  // 1 minute window
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000, // 2 seconds
  },
  CACHE: {
    DEFAULT_TTL: 30000, // 30 seconds default cache time
    DASHBOARD_TTL: 60000, // 1 minute for dashboard data
    ANALYTICS_TTL: 120000, // 2 minutes for analytics data
    USER_DATA_TTL: 300000, // 5 minutes for user data
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
    },
    DASHBOARD: '/analytics/dashboard',
    ANALYTICS: '/analytics',
    LEADS: '/leads',
    EMAIL_CAMPAIGNS: '/emails/campaigns',
    USER_SETTINGS: '/users/settings',
    ADMIN_DASHBOARD: '/admin/dashboard',
  }
}

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}
