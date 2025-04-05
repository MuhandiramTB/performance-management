import { Users, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

interface DashboardOverviewProps {
  totalUsers: number
  activeSessions: number
  systemUptime: string
  securityAlerts: number
  recentActivity: {
    id: string
    action: string
    user: string
    timestamp: string
    details: string
    type: 'info' | 'warning' | 'success' | 'error'
  }[]
}

export function DashboardOverview({
  totalUsers,
  activeSessions,
  systemUptime,
  securityAlerts,
  recentActivity
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white mt-1">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              +12%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Sessions</p>
              <p className="text-2xl font-bold text-white mt-1">{activeSessions}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              +5%
            </span>
            <span className="text-gray-400 ml-2">from last hour</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">System Uptime</p>
              <p className="text-2xl font-bold text-white mt-1">{systemUptime}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              All systems operational
            </span>
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Security Alerts</p>
              <p className="text-2xl font-bold text-white mt-1">{securityAlerts}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-400 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Requires attention
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.slice(0, 3).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-[#151524] hover:bg-[#1E293B] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.type === 'warning' ? 'bg-yellow-500' :
                  log.type === 'info' ? 'bg-blue-500' :
                  log.type === 'error' ? 'bg-red-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-white">{log.action}</p>
                    <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-white">Database</span>
              </div>
              <span className="text-sm text-gray-400">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-white">API Server</span>
              </div>
              <span className="text-sm text-gray-400">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-white">Cache Server</span>
              </div>
              <span className="text-sm text-gray-400">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-white">File Storage</span>
              </div>
              <span className="text-sm text-gray-400">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 