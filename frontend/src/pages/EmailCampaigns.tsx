import { useState } from 'react'
import { 
  Plus, 
  Mail, 
  Users, 
  Send, 
  Eye,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApi } from '../hooks/useApi'

interface EmailCampaign {
  id: string
  name: string
  subject: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  recipients: number
  sent: number
  opened: number
  clicked: number
  scheduledAt: string
  createdAt: string
  template: string
}

export default function EmailCampaigns() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: campaigns = [], isLoading, error, refetch } = useApi<EmailCampaign[]>({
    url: '/api/emails/campaigns',
    cacheTime: 60000, // Cache for 1 minute
    retryAttempts: 3,
    retryDelay: 2000,
    onError: (error) => {
      // Fallback to mock data on error
      console.log('Using mock data due to API error:', error)
    }
  })

  // Fallback mock data if API fails
  const fallbackCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'Q4 Product Launch',
      subject: 'Introducing Our New Product Suite',
      status: 'sent',
      recipients: 1500,
      sent: 1500,
      opened: 450,
      clicked: 89,
      scheduledAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-10',
      template: 'product-launch'
    },
    {
      id: '2',
      name: 'Welcome Series',
      subject: 'Welcome to LeadsFynder!',
      status: 'sending',
      recipients: 500,
      sent: 320,
      opened: 96,
      clicked: 24,
      scheduledAt: '2024-01-20T14:00:00Z',
      createdAt: '2024-01-18',
      template: 'welcome-series'
    },
    {
      id: '3',
      name: 'Follow-up Campaign',
      subject: 'Don\'t Miss Out on These Opportunities',
      status: 'scheduled',
      recipients: 800,
      sent: 0,
      opened: 0,
      clicked: 0,
      scheduledAt: '2024-01-25T09:00:00Z',
      createdAt: '2024-01-22',
      template: 'follow-up'
    }
  ]

  // Use API data if available, otherwise fallback to mock data
  const displayCampaigns = campaigns && campaigns.length > 0 ? campaigns : fallbackCampaigns

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'sending': return 'bg-yellow-100 text-yellow-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />
      case 'scheduled': return <Calendar className="h-4 w-4" />
      case 'sending': return <Send className="h-4 w-4" />
      case 'sent': return <CheckCircle className="h-4 w-4" />
      case 'paused': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredCampaigns = displayCampaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCampaignAction = async (campaignId: string, action: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/emails/campaigns/${campaignId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success(`Campaign ${action} successful`)
        refetch() // Refresh data using the new hook
      } else {
        toast.error(`Failed to ${action} campaign`)
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const calculateOpenRate = (opened: number, sent: number) => {
    return sent > 0 ? ((opened / sent) * 100).toFixed(1) : '0'
  }

  const calculateClickRate = (clicked: number, sent: number) => {
    return sent > 0 ? ((clicked / sent) * 100).toFixed(1) : '0'
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
          <h1 className="text-2xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600">Create and manage your email marketing campaigns</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sending">Sending</option>
            <option value="sent">Sent</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name || 'Unnamed Campaign'}</h3>
                  <p className="text-sm text-gray-600">{campaign.subject || 'No subject'}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button 
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => handleCampaignAction(campaign.id, 'view')}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  className="text-green-600 hover:text-green-900"
                  onClick={() => handleCampaignAction(campaign.id, 'edit')}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleCampaignAction(campaign.id, 'delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recipients:</span>
                <span className="font-medium">{(campaign.recipients || 0).toLocaleString()}</span>
              </div>
              
              {campaign.status === 'sent' || campaign.status === 'sending' ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sent:</span>
                    <span className="font-medium">{(campaign.sent || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Opened:</span>
                    <span className="font-medium">{(campaign.opened || 0).toLocaleString()} ({calculateOpenRate(campaign.opened || 0, campaign.sent || 0)}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Clicked:</span>
                    <span className="font-medium">{(campaign.clicked || 0).toLocaleString()} ({calculateClickRate(campaign.clicked || 0, campaign.sent || 0)}%)</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">{campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                  {campaign.status ? campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first email campaign.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center mx-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
