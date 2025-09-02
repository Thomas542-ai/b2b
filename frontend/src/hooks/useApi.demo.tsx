import React from 'react'
import { useApi } from './useApi'

// Demo component to test useApi hook
export function UseApiDemo() {
  const { data, isLoading, error, refetch } = useApi<{ message: string }>({
    url: '/api/test',
    cacheTime: 5000, // 5 seconds
    retryAttempts: 2,
    retryDelay: 1000
  })

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">useApi Hook Demo</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>Data:</strong> {data ? JSON.stringify(data) : 'None'}
        </div>
        
        <div>
          <strong>Error:</strong> {error || 'None'}
        </div>
        
        <button 
          onClick={refetch}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refetch
        </button>
      </div>
    </div>
  )
}
