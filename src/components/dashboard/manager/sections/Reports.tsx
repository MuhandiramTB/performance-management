'use client'

import { useState } from 'react'
import { BarChart, PieChart, LineChart, Download, Calendar, Filter, ChevronRight, FileText } from 'lucide-react'

interface Report {
  id: number
  title: string
  description: string
  type: 'Performance' | 'Feedback' | 'Goals' | 'Attendance'
  format: 'Chart' | 'Table' | 'Summary'
  period: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'
  lastGenerated: string
  downloadUrl: string
}

export function Reports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [reports, setReports] = useState<Report[]>([])

  const getReportIcon = (type: string, format: string) => {
    if (format === 'Chart') {
      switch (type) {
        case 'Performance':
          return <BarChart className="w-5 h-5 text-purple-500" />
        case 'Feedback':
          return <PieChart className="w-5 h-5 text-blue-500" />
        case 'Goals':
          return <LineChart className="w-5 h-5 text-green-500" />
        default:
          return <FileText className="w-5 h-5 text-gray-500" />
      }
    }
    return <FileText className="w-5 h-5 text-gray-500" />
  }

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'Weekly':
        return 'bg-blue-500/10 text-blue-500'
      case 'Monthly':
        return 'bg-purple-500/10 text-purple-500'
      case 'Quarterly':
        return 'bg-green-500/10 text-green-500'
      case 'Annual':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesPeriod = selectedPeriod === 'all' || report.period === selectedPeriod

    return matchesSearch && matchesType && matchesPeriod
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Types</option>
              <option value="Performance">Performance</option>
              <option value="Feedback">Feedback</option>
              <option value="Goals">Goals</option>
              <option value="Attendance">Attendance</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
            >
              <option value="all">All Periods</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-[#151524] rounded-lg p-4 hover:bg-[#1c1c2e] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                  {getReportIcon(report.type, report.format)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{report.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPeriodColor(report.period)}`}>
                      {report.period}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(report.downloadUrl, '_blank')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-4">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">No reports found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
} 