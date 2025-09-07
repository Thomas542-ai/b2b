import axios from 'axios'

// Dynamic API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:8000/api' : '/api')

// Use the correct auth prefix for the backend
const FINAL_AUTH_PREFIX = '/auth'

// Debug logging
console.log('🔧 Auth service config:', {
  FINAL_AUTH_PREFIX,
  API_URL,
  actualEndpoint: API_URL + FINAL_AUTH_PREFIX + '/login'
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
    const endpoint = FINAL_AUTH_PREFIX + '/login'
    const fullUrl = API_URL + endpoint
    console.log('🔍 LOGIN - Using /api/auth/login:', {
      endpoint,
      fullUrl
    })
    
    try {
      const response = await api.post(endpoint, { email, password })
      console.log('✅ Login successful:', response.data)
      
      // Transform backend response to match frontend expectations
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message
      }
    } catch (error: any) {
      console.error('❌ Login failed:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      })
      throw error
    }
  },

  async register(userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    company?: string
    phone?: string
  }) {
    const endpoint = FINAL_AUTH_PREFIX + '/register'
    console.log('🔍 REGISTER - Using /api/register:', {
      endpoint,
      fullUrl: API_URL + endpoint
    })
    const response = await api.post(endpoint, userData)
    
    // Transform backend response to match frontend expectations
    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
      message: response.data.message
    }
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
