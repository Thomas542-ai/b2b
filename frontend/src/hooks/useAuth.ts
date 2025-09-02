import { useState, useEffect } from 'react'

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
    // Check if user is already authenticated (has token and user data)
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        // Invalid user data, clear it
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (response.ok) {
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
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
