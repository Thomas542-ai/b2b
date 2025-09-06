import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

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
    console.log('Making login request to:', API_URL + '/auth/login')
    const response = await api.post('/auth/login', { email, password })
    console.log('Login response:', response.data)
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
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/users/profile')
    return response.data
  },

  async verifyEmail(token: string) {
    const response = await api.post('/auth/verify-email', { token })
    return response.data
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },
}
