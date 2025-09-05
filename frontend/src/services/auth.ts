import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api')

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    company?: string
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
