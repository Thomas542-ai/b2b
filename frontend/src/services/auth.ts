import axios from 'axios'

// Dynamic API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api')

// Dynamic endpoint paths based on environment
// For Vercel deployment, we need to detect if we're in production
const isLocalDev = import.meta.env.DEV || window.location.hostname === 'localhost'
// In production (Vercel), the endpoints are directly under /api (no /auth prefix)
// In local dev, they're under /api/auth
const AUTH_PREFIX = isLocalDev ? '/auth' : ''

// Debug logging
console.log('Auth service config:', {
  isLocalDev,
  AUTH_PREFIX,
  API_URL,
  hostname: window.location.hostname,
  env: import.meta.env.DEV
})

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(email: string, password: string) {
    const endpoint = AUTH_PREFIX + '/login'
    console.log('Login request:', {
      endpoint,
      fullUrl: API_URL + endpoint,
      baseURL: API_URL,
      AUTH_PREFIX
    })
    const response = await api.post(endpoint, { email, password })
    return response.data
  },

  async register(userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    company?: string
    phone?: string
  }) {
    const response = await api.post(AUTH_PREFIX + '/register', userData)
    return response.data
  },

  async logout() {
    // Clear local storage and redirect - no server call needed
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    return { success: true, message: 'Logged out successfully' }
  },

  async getCurrentUser() {
    // Get user from token since we don't have profile endpoint in Vercel
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No token found')
    }
    
    // Decode token to get user info (frontend only)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role
        }
      }
    } catch (error) {
      throw new Error('Invalid token')
    }
  },

  async verifyEmail(token: string) {
    // Not implemented in Vercel - return success for now
    return { success: true, message: 'Email verification not implemented' }
  },

  async forgotPassword(email: string) {
    // Not implemented in Vercel - return success for now
    return { success: true, message: 'Password reset not implemented' }
  },

  async resetPassword(token: string, password: string) {
    // Not implemented in Vercel - return success for now
    return { success: true, message: 'Password reset not implemented' }
  },
}
