import { useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { isAuthenticated, getUserFromToken, removeToken } from '../utils/jwt'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          // Invalid user data, clear it
          removeToken()
          localStorage.removeItem('user')
          setIsAuthenticated(false)
        }
      } else {
        // Try to get user info from token
        const tokenUser = getUserFromToken()
        if (tokenUser) {
          setUser({
            id: tokenUser.userId,
            email: tokenUser.email,
            role: tokenUser.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN'
          })
          setIsAuthenticated(true)
        } else {
          removeToken()
          setIsAuthenticated(false)
        }
      }
    } else {
      // Token is expired or doesn't exist
      removeToken()
      localStorage.removeItem('user')
      setIsAuthenticated(false)
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password)
      
      if (result.success) {
        // Store token and user data
        localStorage.setItem('token', result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        setUser(result.user)
        setIsAuthenticated(true)
        return result
      } else {
        throw new Error(result.message || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of backend response
      removeToken()
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
