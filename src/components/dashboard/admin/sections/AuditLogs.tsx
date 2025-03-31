'use client'

import { useState } from 'react'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  ipAddress: string
  status: 'success' | 'failure'
}

interface AuditLogsProps {
  onBack: () => void
}

export function AuditLogs({ onBack }: AuditLogsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failure'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [logs, setLogs] = useState<AuditLog[]>([])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg bg-[#1a1b2e]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-white">Audit Logs</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b2e] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6c47ff] transition-colors"
          />
          <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'success' | 'failure')}
          className="px-4 py-2.5 bg-[#1a1b2e] border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-[#6c47ff] transition-colors"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failure">Failure</option>
        </select>
      </div>

      <div className="bg-[#1a1b2e] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Details</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#252a3d] transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{log.details}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{log.ipAddress}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.status === 'success' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
} 