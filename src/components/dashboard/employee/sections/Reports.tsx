'use client'

import { useState } from 'react'
import { Calendar, ChevronDown, Eye, Download, X, BarChart2, Users, Target } from 'lucide-react'

interface Report {
  id: number
  title: string
  generatedDate: string
  preview?: {
    summary: {
      totalEmployees: number
      averagePerformance: number
      goalsAchieved: number
    }
    metrics: {
      label: string
      value: number
      icon: React.ElementType
      change: number
    }[]
  }
}

interface PerformanceMetric {
  id: string
  label: string
  checked: boolean
}

export function Reports() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { id: 'productivity', label: 'Productivity', checked: false },
    { id: 'attendance', label: 'Attendance', checked: false },
    { id: 'goal-achievement', label: 'Goal Achievement', checked: false }
  ])

  const availableReports: Report[] = [
    {
      id: 1,
      title: 'Q1 Performance Report',
      generatedDate: 'Generated on Mar 15, 2025',
      preview: {
        summary: {
          totalEmployees: 48,
          averagePerformance: 87,
          goalsAchieved: 156
        },
        metrics: [
          {
            label: 'Productivity',
            value: 92,
            icon: BarChart2,
            change: 8.2
          },
          {
            label: 'Team Size',
            value: 48,
            icon: Users,
            change: 2.5
          },
          {
            label: 'Goals Achieved',
            value: 156,
            icon: Target,
            change: 12.3
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Engineering Team Report',
      generatedDate: 'Generated on Mar 10, 2025',
      preview: {
        summary: {
          totalEmployees: 24,
          averagePerformance: 91,
          goalsAchieved: 78
        },
        metrics: [
          {
            label: 'Productivity',
            value: 95,
            icon: BarChart2,
            change: 10.5
          },
          {
            label: 'Team Size',
            value: 24,
            icon: Users,
            change: 0
          },
          {
            label: 'Goals Achieved',
            value: 78,
            icon: Target,
            change: 15.7
          }
        ]
      }
    },
    {
      id: 3,
      title: 'Sales Team Report',
      generatedDate: 'Generated on Mar 5, 2025',
      preview: {
        summary: {
          totalEmployees: 16,
          averagePerformance: 84,
          goalsAchieved: 42
        },
        metrics: [
          {
            label: 'Productivity',
            value: 88,
            icon: BarChart2,
            change: 5.3
          },
          {
            label: 'Team Size',
            value: 16,
            icon: Users,
            change: -2.1
          },
          {
            label: 'Goals Achieved',
            value: 42,
            icon: Target,
            change: 8.9
          }
        ]
      }
    }
  ]

  const handleMetricToggle = (metricId: string) => {
    setMetrics(metrics.map(metric => 
      metric.id === metricId ? { ...metric, checked: !metric.checked } : metric
    ))
  }

  const handleGenerateReport = () => {
    const selectedMetrics = metrics.filter(m => m.checked).map(m => m.label)
    console.log('Generating report with:', {
      startDate,
      endDate,
      department,
      selectedMetrics
    })
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Generation Options */}
        <div className="bg-[#151524] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Report Generation Options</h2>
          
          <div className="space-y-6">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Date Range</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="yyyy-mm-dd"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-gray-400">to</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="yyyy-mm-dd"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Department</label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                >
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>HR</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-400">Performance Metrics</label>
              <div className="space-y-2">
                {metrics.map((metric) => (
                  <label
                    key={metric.id}
                    className="flex items-center gap-3 px-4 py-2 bg-[#1E293B] rounded-lg cursor-pointer hover:bg-[#1E293B]/80 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={metric.checked}
                      onChange={() => handleMetricToggle(metric.id)}
                      className="w-4 h-4 rounded border-gray-600 text-[#6c47ff] focus:ring-[#6c47ff] focus:ring-offset-0 bg-[#1E293B]"
                    />
                    <span className="text-white">{metric.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={!startDate || !endDate || !metrics.some(m => m.checked)}
              className="w-full px-4 py-2 bg-[#6c47ff] text-white rounded-lg font-medium hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-[#151524] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Available Reports</h2>
          <div className="space-y-4">
            {availableReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-[#1E293B] rounded-lg"
              >
                <div>
                  <h3 className="text-white font-medium">{report.title}</h3>
                  <p className="text-sm text-gray-400">{report.generatedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewReport(report)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {selectedReport && (
        <div className="bg-[#151524] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{selectedReport.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{selectedReport.generatedDate}</p>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {selectedReport.preview && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#1E293B] rounded-lg p-4">
                  <p className="text-sm text-gray-400">Total Employees</p>
                  <p className="text-2xl font-semibold text-white mt-1">
                    {selectedReport.preview.summary.totalEmployees}
                  </p>
                </div>
                <div className="bg-[#1E293B] rounded-lg p-4">
                  <p className="text-sm text-gray-400">Average Performance</p>
                  <p className="text-2xl font-semibold text-white mt-1">
                    {selectedReport.preview.summary.averagePerformance}%
                  </p>
                </div>
                <div className="bg-[#1E293B] rounded-lg p-4">
                  <p className="text-sm text-gray-400">Goals Achieved</p>
                  <p className="text-2xl font-semibold text-white mt-1">
                    {selectedReport.preview.summary.goalsAchieved}
                  </p>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-4">
                {selectedReport.preview.metrics.map((metric, index) => (
                  <div key={index} className="bg-[#1E293B] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#6c47ff]/20 flex items-center justify-center">
                          <metric.icon className="w-5 h-5 text-[#6c47ff]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{metric.label}</p>
                          <p className="text-2xl font-semibold text-white">{metric.value}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        metric.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 