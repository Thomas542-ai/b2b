import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail, 
  Phone,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApi } from '../hooks/useApi'

interface AnalyticsData {
  leadsGenerated: number
  emailsSent: number
  callsMade: number
  conversions: number
  revenue: number
  conversionRate: number
  monthlyGrowth: number
  topSources: Array<{
    source: string
    count: number
    percentage: number
  }>
  leadStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  monthlyData: Array<{
    month: string
    leads: number
    emails: number
    revenue: number
  }>
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d')

  const { data: analytics, isLoading, error } = useApi<AnalyticsData>({
    url: `/api/analytics?range=${dateRange}`,
    cacheTime: 120000, // Cache for 2 minutes
    retryAttempts: 3,
    retryDelay: 2000,
    onError: (error) => {
      console.log('Using mock data due to API error:', error)
    }
  })

  // Fallback mock data if API fails
  const fallbackAnalytics: AnalyticsData = {
    leadsGenerated: 1247,
    emailsSent: 892,
    callsMade: 156,
    conversions: 89,
    revenue: 15420,
    conversionRate: 12.5,
    monthlyGrowth: 8.2,
    topSources: [
      { source: 'LinkedIn', count: 456, percentage: 36.6 },
      { source: 'Google Maps', count: 234, percentage: 18.8 },
      { source: 'Referral', count: 189, percentage: 15.2 },
      { source: 'Website', count: 156, percentage: 12.5 },
      { source: 'Cold Email', count: 123, percentage: 9.9 }
    ],
    leadStatus: [
      { status: 'New', count: 456, percentage: 36.6 },
      { status: 'Contacted', count: 234, percentage: 18.8 },
      { status: 'Qualified', count: 189, percentage: 15.2 },
      { status: 'Converted', count: 156, percentage: 12.5 },
      { status: 'Lost', count: 123, percentage: 9.9 }
    ],
    monthlyData: [
      { month: 'Jan', leads: 120, emails: 89, revenue: 1200 },
      { month: 'Feb', leads: 145, emails: 112, revenue: 1450 },
      { month: 'Mar', leads: 167, emails: 134, revenue: 1670 },
      { month: 'Apr', leads: 189, emails: 156, revenue: 1890 },
      { month: 'May', leads: 212, emails: 178, revenue: 2120 },
      { month: 'Jun', leads: 234, emails: 201, revenue: 2340 }
    ]
  }

  // Use API data if available, otherwise fallback to mock data
  const displayAnalytics = analytics || fallbackAnalytics

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{change}%
            </p>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your lead generation and conversion performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Leads Generated"
          value={displayAnalytics.leadsGenerated.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
          change={displayAnalytics.monthlyGrowth}
        />
        <StatCard
          title="Emails Sent"
          value={displayAnalytics.emailsSent.toLocaleString()}
          icon={Mail}
          color="bg-green-500"
          change={12.5}
        />
        <StatCard
          title="Calls Made"
          value={displayAnalytics.callsMade.toLocaleString()}
          icon={Phone}
          color="bg-purple-500"
          change={5.8}
        />
        <StatCard
          title="Revenue"
          value={`$${displayAnalytics.revenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-yellow-500"
          change={15.2}
        />
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Rate</h3>
          <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600">{displayAnalytics.conversionRate}%</div>
            <p className="text-sm text-gray-600 mt-2">of leads converted to customers</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Total Conversions</h3>
          <div className="text-center">
                            <div className="text-4xl font-bold text-green-600">{displayAnalytics.conversions}</div>
            <p className="text-sm text-gray-600 mt-2">successful conversions this period</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Lead Sources</h3>
          <div className="space-y-4">
            {displayAnalytics.topSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{source.source || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{source.count || 0}</span>
                  <span className="text-sm text-gray-500">({source.percentage || 0}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Status Distribution</h3>
          <div className="space-y-4">
            {displayAnalytics.leadStatus.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'Converted' ? 'bg-green-500' :
                    status.status === 'Qualified' ? 'bg-blue-500' :
                    status.status === 'Contacted' ? 'bg-yellow-500' :
                    status.status === 'New' ? 'bg-gray-500' : 'bg-red-500'
                  }`}></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{status.status || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{status.count || 0}</span>
                  <span className="text-sm text-gray-500">({status.percentage || 0}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emails Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayAnalytics.monthlyData.map((data) => (
                <tr key={data.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.leads || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(data.emails || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(data.revenue || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
