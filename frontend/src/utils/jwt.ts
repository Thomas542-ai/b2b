/**
 * JWT Token Utilities
 * Note: These utilities only handle token storage and basic validation
 * The actual JWT secret is kept secure on the backend
 */

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Decode JWT token payload (without verification)
 * This is safe to do on the frontend as it doesn't verify the signature
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token)
  if (!payload) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

/**
 * Get token from localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * Store token in localStorage
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('token', token)
}

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token')
}

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = getStoredToken()
  if (!token) return false
  
  return !isTokenExpired(token)
}

/**
 * Get user info from token
 */
export const getUserFromToken = (): JWTPayload | null => {
  const token = getStoredToken()
  if (!token || isTokenExpired(token)) return null
  
  return decodeJWT(token)
}
