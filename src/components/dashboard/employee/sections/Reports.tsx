'use client'

import React, { useState, useEffect } from 'react'
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
  AlertTriangle,
  Loader2,
  RefreshCw,
  Save,
  Share2,
  Printer,
  LayoutGrid,
  List,
  BarChart,
  LineChart,
  PieChart,
  ChevronUp,
  Check,
  AlertCircle,
  Layout,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Table,
  Mail,
  Bell,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Star,
  StarOff,
  Lock,
  Unlock,
  Share,
  Copy,
  ExternalLink,
  HelpCircle,
  Info,
  XCircle,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Settings,
  Plus as PlusIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  X as XIcon,
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
  FileText as FileTextIcon,
  Layout as LayoutIcon,
  BarChart2 as BarChart2Icon,
  PieChartIcon as PieChartIconComponent,
  LineChartIcon as LineChartIconComponent,
  Table as TableIcon,
  Mail as MailIcon,
  Bell as BellIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  MoreVertical as MoreVerticalIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Star as StarIcon,
  StarOff as StarOffIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Share as ShareIcon,
  Copy as CopyIcon,
  ExternalLink as ExternalLinkIcon,
  HelpCircle as HelpCircleIcon,
  Info as InfoIcon,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Minus as MinusIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Eye as EyeIcon,
} from 'lucide-react'
import { format } from 'date-fns'

interface ReportTemplate {
  id: string
  name: string
  description: string
  metrics: string[]
  visualizations: string[]
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
    dayOfWeek?: number
    dayOfMonth?: number
    time?: string
  }
  isDefault: boolean
  isCustom: boolean
}

interface Report {
  id: string
  title: string
  type: 'performance' | 'attendance' | 'feedback' | 'custom'
  date: Date
  metrics: PerformanceMetric[]
  visualizations: Visualization[]
  summary: string
  recommendations: string[]
  status: 'draft' | 'published' | 'archived'
  template?: ReportTemplate
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
    dayOfWeek?: number
    dayOfMonth?: number
    time?: string
    lastGenerated?: Date
    nextGeneration?: Date
  }
  isFavorite: boolean
  isShared: boolean
  sharedWith?: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

interface PerformanceMetric {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  category: string
  period: string
  comparison?: {
    previous: number
    change: number
    percentage: number
  }
}

interface Visualization {
  id: string
  type: 'bar' | 'line' | 'pie' | 'table' | 'kpi'
  title: string
  data: any
  options: any
  metrics: string[]
  period: string
  isInteractive: boolean
  isExportable: boolean
}

interface DashboardWidget {
  id: string
  type: 'chart' | 'kpi' | 'table' | 'list'
  title: string
  data: any
  options: any
  refreshInterval?: number
  lastUpdated?: Date
  isCollapsed: boolean
  position: {
    x: number
    y: number
    w: number
    h: number
  }
}

interface ExportFormat {
  id: string
  name: string
  extension: string
  icon: React.ReactNode
  mimeType: string
}

const exportFormats: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF Document',
    extension: 'pdf',
    icon: <FileTextIcon className="w-5 h-5" />,
    mimeType: 'application/pdf',
  },
  {
    id: 'excel',
    name: 'Excel Spreadsheet',
    extension: 'xlsx',
    icon: <TableIcon className="w-5 h-5" />,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    id: 'csv',
    name: 'CSV File',
    extension: 'csv',
    icon: <TableIcon className="w-5 h-5" />,
    mimeType: 'text/csv',
  },
  {
    id: 'json',
    name: 'JSON Data',
    extension: 'json',
    icon: <FileTextIcon className="w-5 h-5" />,
    mimeType: 'application/json',
  },
]

const defaultTemplates: ReportTemplate[] = [
  {
    id: 'performance-summary',
    name: 'Performance Summary',
    description: 'Comprehensive overview of performance metrics',
    metrics: ['productivity', 'quality', 'attendance', 'feedback'],
    visualizations: ['bar', 'line', 'kpi'],
    isDefault: true,
    isCustom: false,
  },
  {
    id: 'feedback-analysis',
    name: 'Feedback Analysis',
    description: 'Detailed analysis of feedback and sentiment',
    metrics: ['feedback', 'sentiment', 'response-time'],
    visualizations: ['pie', 'line', 'table'],
    isDefault: true,
    isCustom: false,
  },
  {
    id: 'attendance-report',
    name: 'Attendance Report',
    description: 'Attendance and time tracking analysis',
    metrics: ['attendance', 'late-arrivals', 'overtime'],
    visualizations: ['bar', 'table', 'kpi'],
    isDefault: true,
    isCustom: false,
  },
]

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>(defaultTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [view, setView] = useState<'dashboard' | 'reports' | 'templates'>('dashboard')
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Utility functions
  const formatDate = (date: Date) => {
    try {
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getMetricColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMetricIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ChevronUpIcon className="w-4 h-4" />;
      case 'down':
        return <ChevronDownIcon className="w-4 h-4" />;
      default:
        return <MinusIcon className="w-4 h-4" />;
    }
  };

  // Event handlers
  const handleGenerateReport = async (template: ReportTemplate) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport: Report = {
        id: `report-${Date.now()}`,
        title: `${template.name} Report`,
        type: 'custom',
        date: new Date(),
        metrics: [],
        visualizations: [],
        summary: '',
        recommendations: [],
        status: 'draft',
        template,
        isFavorite: false,
        isShared: false,
        createdBy: 'Current User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setReports(prev => [newReport, ...prev]);
      setShowSuccessMessage(true);
      setSuccessMessage('Report generated successfully');
    } catch (err) {
      setError('Failed to generate report');
      setShowErrorMessage(true);
      setErrorMessage('Failed to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (report: Report, format: ExportFormat) => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setShowSuccessMessage(true);
      setSuccessMessage(`Report exported as ${format.name}`);
    } catch (err) {
      setError('Failed to export report');
      setShowErrorMessage(true);
      setErrorMessage('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleScheduleReport = async (report: Report, schedule: Report['schedule']) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedReport = {
        ...report,
        schedule,
      };

      setReports(prev => prev.map(r => r.id === report.id ? updatedReport : r));
      setShowSuccessMessage(true);
      setSuccessMessage('Report scheduled successfully');
    } catch (err) {
      setError('Failed to schedule report');
      setShowErrorMessage(true);
      setErrorMessage('Failed to schedule report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort functions
  const filteredReports = reports
    .filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || report.type === selectedType;
      const matchesPeriod = selectedPeriod === 'all' || 
        (selectedPeriod === 'this-month' && report.date.getMonth() === new Date().getMonth()) ||
        (selectedPeriod === 'last-month' && report.date.getMonth() === new Date().getMonth() - 1);
      return matchesSearch && matchesType && matchesPeriod;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return sortOrder === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    });

  const paginatedReports = filteredReports.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Reports</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setView('dashboard')}
            className={`px-4 py-2 rounded-lg ${
              view === 'dashboard'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <LayoutIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('reports')}
            className={`px-4 py-2 rounded-lg ${
              view === 'reports'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <FileTextIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('templates')}
            className={`px-4 py-2 rounded-lg ${
              view === 'templates'
                ? 'bg-[#6c47ff] text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6c47ff]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-[#1E293B] text-gray-400 rounded-lg hover:text-white"
        >
          <FilterIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-[#1E293B] rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-[#151524] border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="performance">Performance</option>
                <option value="attendance">Attendance</option>
                <option value="feedback">Feedback</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-[#151524] border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] sm:text-sm rounded-md"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'type')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-[#151524] border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#6c47ff] sm:text-sm rounded-md"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {view === 'dashboard' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard widgets will be rendered here */}
        </div>
      ) : view === 'reports' ? (
        <div className="space-y-4">
          {layout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReports.map(report => (
                <div
                  key={report.id}
                  className="bg-[#1E293B] rounded-lg p-4 hover:bg-[#1E293B]/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExportReport(report, exportFormats[0])}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      {formatDate(report.date)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Type: {report.type}
                    </p>
                    <p className="text-sm text-gray-400">
                      Status: {report.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReports.map(report => (
                <div
                  key={report.id}
                  className="bg-[#1E293B] rounded-lg p-4 hover:bg-[#1E293B]/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                      <p className="text-sm text-gray-400">{formatDate(report.date)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExportReport(report, exportFormats[0])}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-[#1E293B] rounded-lg p-4 hover:bg-[#1E293B]/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                <button
                  onClick={() => handleGenerateReport(template)}
                  className="px-4 py-2 bg-[#6c47ff] text-white rounded-lg hover:bg-[#5a3dd8]"
                >
                  Generate
                </button>
              </div>
              <p className="text-sm text-gray-400">{template.description}</p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400">Metrics:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {template.metrics.map(metric => (
                    <span
                      key={metric}
                      className="px-2 py-1 bg-[#151524] text-gray-400 rounded-full text-xs"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#151524] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedReport.title}</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            {/* Report details will be rendered here */}
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {showErrorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
}