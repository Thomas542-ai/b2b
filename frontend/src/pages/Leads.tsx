import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Building,
  User,
  Calendar,
  Tag
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useApi } from '../hooks/useApi'

interface Lead {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  tags: string[]
  createdAt: string
  lastContacted: string
}

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const { data: leads = [], isLoading, error, refetch } = useApi<Lead[]>({
    url: '/api/leads',
    cacheTime: 60000, // Cache for 1 minute
    retryAttempts: 3,
    retryDelay: 2000,
    onError: (error) => {
      console.log('Using mock data due to API error:', error)
    }
  })

  // Fallback mock data if API fails
  const fallbackLeads: Lead[] = [
    {
      id: '1',
      companyName: 'TechCorp Solutions',
      contactName: 'John Smith',
      email: 'john@techcorp.com',
      phone: '+1 (555) 123-4567',
      website: 'techcorp.com',
      address: '123 Business Ave',
      city: 'San Francisco, CA',
      status: 'qualified',
      source: 'LinkedIn',
      tags: ['tech', 'enterprise'],
      createdAt: '2024-01-15',
      lastContacted: '2024-01-20'
    },
    {
      id: '2',
      companyName: 'Global Innovations',
      contactName: 'Sarah Johnson',
      email: 'sarah@globalinnovations.com',
      phone: '+1 (555) 987-6543',
      website: 'globalinnovations.com',
      address: '456 Innovation St',
      city: 'New York, NY',
      status: 'contacted',
      source: 'Google Maps',
      tags: ['startup', 'innovation'],
      createdAt: '2024-01-10',
      lastContacted: '2024-01-18'
    },
    {
      id: '3',
      companyName: 'Digital Dynamics',
      contactName: 'Mike Wilson',
      email: 'mike@digitaldynamics.com',
      phone: '+1 (555) 456-7890',
      website: 'digitaldynamics.com',
      address: '789 Digital Blvd',
      city: 'Austin, TX',
      status: 'converted',
      source: 'Referral',
      tags: ['digital', 'agency'],
      createdAt: '2024-01-05',
      lastContacted: '2024-01-22'
    }
  ]

  // Use API data if available, otherwise fallback to mock data
  const displayLeads = leads && leads.length > 0 ? leads : fallbackLeads

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-yellow-100 text-yellow-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredLeads = displayLeads.filter(lead => {
    const matchesSearch = 
      (lead.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.contactName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your leads and track their progress</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contacted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Building className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.companyName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.website || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.contactName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.email || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.source || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
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
