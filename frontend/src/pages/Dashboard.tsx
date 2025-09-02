import { useState } from 'react'
import { 
  Users, 
  Mail, 
  Phone, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApi } from '../hooks/useApi'

interface DashboardStats {
  totalLeads: number
  totalEmails: number
  totalCalls: number
  conversionRate: number
  monthlyRevenue: number
  activeCampaigns: number
  pendingFollowUps: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useApi<DashboardStats>({
    url: '/api/analytics/dashboard',
    cacheTime: 60000, // Cache for 1 minute
    retryAttempts: 3,
    retryDelay: 2000,
    onError: (error) => {
      console.log('Using mock data due to API error:', error)
    }
  })

  // Fallback mock data if API fails
  const fallbackStats: DashboardStats = {
    totalLeads: 1247,
    totalEmails: 892,
    totalCalls: 156,
    conversionRate: 12.5,
    monthlyRevenue: 15420,
    activeCampaigns: 8,
    pendingFollowUps: 23,
    recentActivity: [
      {
        id: '1',
        type: 'lead',
        message: 'New lead added: John Smith from TechCorp',
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        type: 'email',
        message: 'Email campaign "Q4 Outreach" sent to 150 contacts',
        timestamp: '4 hours ago'
      },
      {
        id: '3',
        type: 'call',
        message: 'Follow-up call scheduled with Sarah Johnson',
        timestamp: '6 hours ago'
      },
      {
        id: '4',
        type: 'conversion',
        message: 'Lead converted: Mike Wilson signed up for Premium plan',
        timestamp: '1 day ago'
      }
    ]
  }

  // Use API data if available, otherwise fallback to mock data
  const displayStats = stats || fallbackStats

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

  const ActivityItem = ({ activity }: any) => {
    const getIcon = (type: string) => {
      switch (type) {
        case 'lead': return <Users className="h-4 w-4" />
        case 'email': return <Mail className="h-4 w-4" />
        case 'call': return <Phone className="h-4 w-4" />
        case 'conversion': return <CheckCircle className="h-4 w-4" />
        default: return <Clock className="h-4 w-4" />
      }
    }

    const getColor = (type: string) => {
      switch (type) {
        case 'lead': return 'text-blue-600 bg-blue-100'
        case 'email': return 'text-green-600 bg-green-100'
        case 'call': return 'text-purple-600 bg-purple-100'
        case 'conversion': return 'text-yellow-600 bg-yellow-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }

    return (
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${getColor(activity.type)}`}>
          {getIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{activity.message || 'No message'}</p>
          <p className="text-xs text-gray-500">{activity.timestamp || 'No timestamp'}</p>
        </div>
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your leads.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Add Lead
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={displayStats.totalLeads.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
          change={8.2}
        />
        <StatCard
          title="Emails Sent"
          value={displayStats.totalEmails.toLocaleString()}
          icon={Mail}
          color="bg-green-500"
          change={12.5}
        />
        <StatCard
          title="Calls Made"
          value={displayStats.totalCalls.toLocaleString()}
          icon={Phone}
          color="bg-purple-500"
          change={5.8}
        />
        <StatCard
          title="Conversion Rate"
          value={`${displayStats.conversionRate}%`}
          icon={Target}
          color="bg-yellow-500"
          change={2.1}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${displayStats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-semibold text-gray-900">{displayStats.activeCampaigns}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Follow-ups</p>
              <p className="text-2xl font-semibold text-gray-900">{displayStats.pendingFollowUps}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 space-y-4">
          {displayStats.recentActivity.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  )
}
