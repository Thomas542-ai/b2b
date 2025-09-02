import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { getApiUrl } from '../config/api'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  cacheTime?: number // Cache data for this many milliseconds
  retryAttempts?: number
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  skip?: boolean // Skip the API call if true
}

interface UseApiReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearCache: () => void
}

// Global cache to store API responses
const apiCache = new Map<string, { data: any; timestamp: number; cacheTime: number }>()

export function useApi<T>({
  url,
  method = 'GET',
  body,
  headers = {},
  cacheTime = 30000, // 30 seconds default
  retryAttempts = 3,
  retryDelay = 1000,
  onSuccess,
  onError,
  skip = false
}: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const isInitializedRef = useRef(false)

  const getCacheKey = useCallback(() => {
    return `${method}:${url}:${JSON.stringify(body || {})}`
  }, [method, url, body])

  const getCachedData = useCallback(() => {
    const cacheKey = getCacheKey()
    const cached = apiCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < cached.cacheTime) {
      return cached.data
    }
    
    // Remove expired cache entry
    if (cached) {
      apiCache.delete(cacheKey)
    }
    
    return null
  }, [getCacheKey])

  const setCachedData = useCallback((data: T) => {
    const cacheKey = getCacheKey()
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      cacheTime
    })
  }, [getCacheKey, cacheTime])

  const clearCache = useCallback(() => {
    const cacheKey = getCacheKey()
    apiCache.delete(cacheKey)
  }, [getCacheKey])

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  const executeRequest = useCallback(async (): Promise<void> => {
    if (skip) return

    // Check cache first
    const cachedData = getCachedData()
    if (cachedData) {
      setData(cachedData)
      setError(null)
      return
    }

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      }

      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }

      const fullUrl = url.startsWith('http') ? url : getApiUrl(url)
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: abortControllerRef.current.signal
      })

      if (response.status === 429) {
        // Rate limited - wait and retry
        if (retryCountRef.current < retryAttempts) {
          retryCountRef.current++
          const waitTime = retryDelay * Math.pow(2, retryCountRef.current - 1) // Exponential backoff
          
          toast.error(`Rate limited. Retrying in ${Math.ceil(waitTime / 1000)} seconds...`)
          
          // Schedule retry using setTimeout
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current = 0 // Reset retry count for the retry
            executeRequest() // Call the function again
          }, waitTime)
          return
        } else {
          throw new Error('Rate limit exceeded. Please try again later.')
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseData = await response.json()
      
      setData(responseData)
      setCachedData(responseData)
      setError(null)
      retryCountRef.current = 0
      
      onSuccess?.(responseData)
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was aborted, don't show error
        return
      }
      
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      setData(null)
      
      onError?.(err)
      
      if (err.message !== 'Rate limit exceeded. Please try again later.') {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [url, method, body, headers, skip, getCachedData, setCachedData, onSuccess, onError, retryAttempts, retryDelay])

  const refetch = useCallback(async () => {
    clearCache()
    clearRetryTimeout()
    retryCountRef.current = 0
    await executeRequest()
  }, [clearCache, clearRetryTimeout, executeRequest])

  // Only run on mount and when dependencies change
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      executeRequest()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      clearRetryTimeout()
    }
  }, []) // Empty dependency array - only run on mount

  return {
    data,
    isLoading,
    error,
    refetch,
    clearCache
  }
}
