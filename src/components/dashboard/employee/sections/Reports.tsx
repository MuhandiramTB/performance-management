'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  ChevronDown, 
  Eye, 
  Download, 
  X, 
  BarChart2, 
  Users, 
  Target,
  Filter,
  Search,
  Plus,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  Share2,
  Printer,
  LayoutGrid,
  List
} from 'lucide-react'

interface Report {
  id: number
  title: string
  generatedDate: string
  type: 'Performance' | 'Goals' | 'Attendance' | 'Training'
  department: string
  status: 'Generated' | 'Processing' | 'Failed'
  preview?: {
    summary: {
      totalEmployees: number
      averagePerformance: number
      goalsAchieved: number
      attendanceRate: number
    }
    metrics: {
      label: string
      value: number
      icon: React.ElementType
      change: number
      trend: 'up' | 'down' | 'neutral'
    }[]
  }
}

interface PerformanceMetric {
  id: string
  label: string
  description: string
  checked: boolean
  icon: React.ElementType
}

export function Reports() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [department, setDepartment] = useState('All Departments')
  const [reportType, setReportType] = useState('Performance')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { 
      id: 'productivity', 
      label: 'Productivity', 
      description: 'Employee productivity metrics and KPIs',
      checked: false,
      icon: BarChart2
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      description: 'Attendance and time tracking data',
      checked: false,
      icon: Clock
    },
    { 
      id: 'goal-achievement', 
      label: 'Goal Achievement', 
      description: 'Performance against set goals',
      checked: false,
      icon: Target
    },
    { 
      id: 'training', 
      label: 'Training Progress', 
      description: 'Training completion and effectiveness',
      checked: false,
      icon: FileText
    }
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [availableReports, setAvailableReports] = useState<Report[]>([])

  useEffect(() => {
    // Set default date range to last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  const handleMetricToggle = (metricId: string) => {
    setMetrics(metrics.map(metric => 
      metric.id === metricId ? { ...metric, checked: !metric.checked } : metric
    ))
  }

  const handleDateChange = (date: string, isStartDate: boolean) => {
    if (isStartDate) {
      setStartDate(date)
      // If end date is before new start date, update it
      if (endDate && date > endDate) {
        setEndDate(date)
      }
    } else {
      setEndDate(date)
      // If start date is after new end date, update it
      if (startDate && date < startDate) {
        setStartDate(date)
      }
    }
  }

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      const selectedMetrics = metrics.filter(m => m.checked).map(m => m.label)
      
      // Validate dates
      if (!startDate || !endDate) {
        throw new Error('Please select both start and end dates')
      }

      if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Start date cannot be after end date')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add a new report to availableReports
      const newReport: Report = {
        id: availableReports.length + 1,
        title: `${reportType} Report - ${new Date().toLocaleDateString()}`,
        type: reportType as Report['type'],
        department: department === 'All Departments' ? 'All' : department,
        generatedDate: `Generated on ${new Date().toLocaleDateString()}`,
        status: 'Generated',
        preview: {
          summary: {
            totalEmployees: 48,
            averagePerformance: 87,
            goalsAchieved: 156,
            attendanceRate: 95
          },
          metrics: [
            {
              label: 'Productivity',
              value: 92,
              icon: BarChart2,
              change: 8.2,
              trend: 'up'
            },
            {
              label: 'Team Size',
              value: 48,
              icon: Users,
              change: 2.5,
              trend: 'up'
            }
          ]
        }
      }

      setAvailableReports(prev => [...prev, newReport])
      setShowSuccessToast(true)
      setToastMessage('Report generated successfully')
    } catch (error) {
      setShowErrorToast(true)
      setToastMessage(error instanceof Error ? error.message : 'Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (report: Report) => {
    try {
      setIsDownloading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowSuccessToast(true)
      setToastMessage('Report downloaded successfully')
    } catch (error) {
      setShowErrorToast(true)
      setToastMessage('Failed to download report. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleShareReport = () => {
    setShowSuccessToast(true)
    setToastMessage('Report shared successfully')
  }

  const handleSaveReport = () => {
    setShowSuccessToast(true)
    setToastMessage('Report saved successfully')
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated':
        return 'bg-green-500/20 text-green-400'
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'Failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Generated':
        return <CheckCircle2 className="w-4 h-4" />
      case 'Processing':
        return <Clock className="w-4 h-4" />
      case 'Failed':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredReports = availableReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = reportType === 'All Types' || report.type === reportType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6c47ff]/10 rounded-lg">
            <BarChart2 className="w-5 h-5 text-[#6c47ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Performance Reports</h1>
            <p className="text-gray-400 mt-1">Generate and view detailed performance reports</p>
          </div>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={!startDate || !endDate || !metrics.some(m => m.checked) || isGenerating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : 'Generate New Report'}
        </button>
      </div>

      {/* Toast Notifications */}
      {(showSuccessToast || showErrorToast) && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
          showSuccessToast ? 'bg-green-500' : 'bg-red-500'
        } text-white flex items-center gap-2 z-50`}>
          {showSuccessToast ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toastMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Generation Options */}
        <div className="bg-[#151524] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Report Generation Options</h2>
          
          <div className="space-y-6">
            {/* Report Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <FileText className="w-4 h-4" />
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
              >
                <option value="Performance">Performance Report</option>
                <option value="Goals">Goals Report</option>
                <option value="Attendance">Attendance Report</option>
                <option value="Training">Training Report</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e.target.value, true)}
                    className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <span className="text-gray-400">to</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(e.target.value, false)}
                    className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Users className="w-4 h-4" />
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
              >
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>HR</option>
              </select>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <Filter className="w-4 h-4" />
                Performance Metrics
              </label>
              <div className="space-y-2">
                {metrics.map((metric) => (
                  <label
                    key={metric.id}
                    className="flex items-center gap-3 px-4 py-3 bg-[#1E293B] rounded-lg cursor-pointer hover:bg-[#1E293B]/80 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={metric.checked}
                      onChange={() => handleMetricToggle(metric.id)}
                      className="w-4 h-4 rounded border-gray-600 text-[#6c47ff] focus:ring-[#6c47ff] focus:ring-offset-0 bg-[#1E293B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <metric.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{metric.label}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{metric.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-[#151524] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Available Reports</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#1E293B] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[#6c47ff] text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[#6c47ff] text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
                />
              </div>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-[#1E293B] rounded-lg hover:bg-[#1E293B]/80 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {report.department} • {report.type} • {report.generatedDate}
                    </p>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-[#1E293B] rounded-lg p-4 hover:bg-[#1E293B]/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{report.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {report.department} • {report.type}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{report.generatedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewReport(report)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDownloadReport(report)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {report.preview && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#151524] rounded-lg p-3">
                          <p className="text-sm text-gray-400">Performance</p>
                          <p className="text-lg font-semibold text-white mt-1">
                            {report.preview.summary.averagePerformance}%
                          </p>
                        </div>
                        <div className="bg-[#151524] rounded-lg p-3">
                          <p className="text-sm text-gray-400">Goals</p>
                          <p className="text-lg font-semibold text-white mt-1">
                            {report.preview.summary.goalsAchieved}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Preview */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#151524] rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedReport.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedReport.department} • {selectedReport.type} • {selectedReport.generatedDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  title="Print Report"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareReport}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  title="Share Report"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSaveReport}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                  title="Save Report"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {selectedReport.preview && (
              <div className="p-6 space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="bg-[#1E293B] rounded-lg p-4">
                    <p className="text-sm text-gray-400">Attendance Rate</p>
                    <p className="text-2xl font-semibold text-white mt-1">
                      {selectedReport.preview.summary.attendanceRate}%
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
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            metric.trend === 'up' 
                              ? 'bg-green-500/20 text-green-400' 
                              : metric.trend === 'down'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}{Math.abs(metric.change)}%
                          </div>
                          {metric.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : metric.trend === 'down' ? (
                            <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}