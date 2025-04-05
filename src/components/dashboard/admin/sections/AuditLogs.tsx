'use client'

interface AuditLog {
  id: string
  action: string
  user: string
  timestamp: string
  details: string
  type: 'info' | 'warning' | 'success' | 'error'
}

interface AuditLogsProps {
  logs: AuditLog[]
  totalLogs: number
  onPageChange: (page: number) => void
  currentPage: number
}

export function AuditLogs({ logs, totalLogs, onPageChange, currentPage }: AuditLogsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Audit Logs</h2>
        <div className="flex space-x-2">
          <select className="bg-[#151524] border border-gray-800/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Actions</option>
            <option value="login">Logins</option>
            <option value="user">User Actions</option>
            <option value="system">System Actions</option>
          </select>
          <select className="bg-[#151524] border border-gray-800/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1a1a2e] rounded-xl border border-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#151524] text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#151524] transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.user}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {log.details}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                      log.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                      log.type === 'error' ? 'bg-red-500/10 text-red-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">Showing {logs.length} of {totalLogs} logs</p>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 bg-[#151524] border border-gray-800/50 rounded-lg text-sm text-white hover:bg-[#1E293B] transition-colors"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 bg-blue-500 rounded-lg text-sm text-white hover:bg-blue-600 transition-colors"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage * 10 >= totalLogs}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}