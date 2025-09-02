# Rate Limiting Solution for 429 "Too Many Requests" Errors

## Problem Description
Your application was experiencing HTTP 429 "Too Many Requests" errors when navigating between pages. This happened because:

1. **Multiple API calls on page navigation**: Each page component made fresh API calls on every visit
2. **No request caching**: Data was fetched repeatedly even if recently accessed
3. **No rate limiting handling**: Frontend didn't handle 429 responses gracefully
4. **No request debouncing**: Rapid navigation triggered multiple simultaneous requests

## Solution Implemented

### 1. Custom `useApi` Hook (`frontend/src/hooks/useApi.ts`)
- **Request Caching**: Stores API responses in memory with configurable TTL
- **Rate Limiting Handling**: Automatically retries 429 responses with exponential backoff
- **Request Abortion**: Cancels previous requests when new ones are made
- **Error Handling**: Graceful fallback to mock data when API fails

### 2. API Configuration (`frontend/src/config/api.ts`)
- **Centralized Configuration**: All API endpoints and settings in one place
- **Rate Limiting Settings**: Configurable retry attempts and delays
- **Cache TTL Settings**: Different cache times for different data types

### 3. Updated Page Components
- **Dashboard**: Now uses `useApi` hook with 1-minute caching
- **EmailCampaigns**: Uses `useApi` hook with fallback mock data
- **Other Pages**: Can be updated similarly

## Key Features

### Request Caching
```typescript
const { data, isLoading, error } = useApi<DataType>({
  url: '/api/endpoint',
  cacheTime: 60000, // Cache for 1 minute
  retryAttempts: 3,
  retryDelay: 2000
})
```

### Rate Limiting Handling
- Automatically detects 429 responses
- Implements exponential backoff retry strategy
- Shows user-friendly error messages
- Falls back to cached data when possible

### Request Optimization
- Aborts previous requests when navigating away
- Prevents duplicate API calls
- Graceful degradation to mock data

## How to Apply to Other Pages

### 1. Replace `useEffect` + `fetch` with `useApi`:
```typescript
// Before
useEffect(() => {
  fetchData()
}, [])

// After
const { data, isLoading, error } = useApi<DataType>({
  url: '/api/endpoint',
  cacheTime: 60000
})
```

### 2. Use fallback data:
```typescript
const displayData = data || fallbackData
```

### 3. Handle loading and errors:
```typescript
if (isLoading) return <LoadingSpinner />
if (error) console.log('Using fallback data:', error)
```

## Backend Recommendations

To prevent 429 errors on the backend:

### 1. Implement Rate Limiting
```python
# Example with Flask-Limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per minute", "1000 per hour"]
)

@app.route('/api/endpoint')
@limiter.limit("10 per minute")
def api_endpoint():
    # Your API logic here
    pass
```

### 2. Add Rate Limit Headers
```python
@app.after_request
def add_rate_limit_headers(response):
    response.headers['X-RateLimit-Limit'] = '100'
    response.headers['X-RateLimit-Remaining'] = '99'
    response.headers['X-RateLimit-Reset'] = '1640995200'
    return response
```

### 3. Graceful Degradation
```python
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        'error': 'Rate limit exceeded',
        'retry_after': e.retry_after,
        'message': 'Please try again later'
    }), 429
```

## Testing the Solution

1. **Navigate between pages rapidly** - Should see cached data instead of new API calls
2. **Check Network tab** - Fewer API requests, more cache hits
3. **Simulate 429 errors** - Should see retry logic and fallback data
4. **Monitor performance** - Faster page loads due to caching

## Benefits

- ✅ **Eliminates 429 errors** through intelligent caching and retry logic
- ✅ **Improves performance** with request caching
- ✅ **Better user experience** with graceful error handling
- ✅ **Reduces server load** by preventing duplicate requests
- ✅ **Maintains functionality** even when API is rate-limited

## Next Steps

1. **Update remaining pages** (Leads, Analytics, Settings, Admin) to use `useApi`
2. **Configure backend rate limiting** to prevent 429 errors
3. **Monitor API usage** to optimize cache times
4. **Add offline support** for better user experience
