import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    // Force page reload to ensure proper rendering
    window.location.href = '/login'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Welcome, {user?.firstName || user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
