'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Filter,
  Search,
  ChevronRight,
  Plus,
  X,
  RefreshCw,
  Bell,
  MessageCircle,
  Calendar,
  CheckSquare,
  PlusCircle,
  ChevronLeft,
  Heart,
  Smile,
  Meh,
  Frown
} from 'lucide-react'
import { NewFeedbackModal } from '../modals/NewFeedbackModal'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface FeedbackStats {
  total: number
  positive: number
  negative: number
  neutral: number
  pending: number
  actionItems: number
}

interface ActionItem {
  id: string
  feedbackId: string
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

interface FeedbackItem {
  id: string
  sender: string
  message: string
  type: 'positive' | 'negative' | 'neutral'
  date: string
  response?: string
  responseDate?: string
  tags: string[]
  sentiment: {
    score: number
    label: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive'
    confidence: number
  }
  actionItems?: ActionItem[]
  isPrivate: boolean
  isRead: boolean
}

interface Notification {
  id: string
  type: 'new_feedback' | 'feedback_response' | 'action_item' | 'reminder'
  message: string
  date: string
  isRead: boolean
  relatedId: string
}

// Remove sample data
const initialFeedback: FeedbackItem[] = []
const initialStats: FeedbackStats = {
  total: 0,
  positive: 0,
  negative: 0,
  neutral: 0,
  pending: 0,
  actionItems: 0
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'No date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return 'Invalid date';
  }
};

export function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>(initialFeedback)
  const [stats, setStats] = useState<FeedbackStats>(initialStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNewFeedbackModal, setShowNewFeedbackModal] = useState(false)
  const [showActionItemModal, setShowActionItemModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [view, setView] = useState<'timeline' | 'conversation'>('conversation')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would fetch from your API
      // const response = await fetch('/api/feedback')
      // const data = await response.json()
      // setFeedback(data)
      
      // For now, we'll just use an empty array
      setFeedback([])
      
      // Update stats based on the fetched data
      updateStats([])
      
      // Update available tags
      updateAvailableTags([])
    } catch (error) {
      console.error('Error fetching feedback:', error)
      setError('Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStats = (feedbackData: FeedbackItem[]) => {
    const total = feedbackData.length
    const positive = feedbackData.filter(f => f.type === 'positive').length
    const negative = feedbackData.filter(f => f.type === 'negative').length
    const neutral = feedbackData.filter(f => f.type === 'neutral').length
    const pending = feedbackData.filter(f => !f.response).length
    const actionItems = feedbackData.reduce((count, f) => count + (f.actionItems?.length || 0), 0)
    
    setStats({
      total,
      positive,
      negative,
      neutral,
      pending,
      actionItems
    })
  }

  const updateAvailableTags = (feedbackData: FeedbackItem[]) => {
    const tags = new Set<string>()
    feedbackData.forEach(f => {
      f.tags.forEach(tag => tags.add(tag))
    })
    setAvailableTags(Array.from(tags))
  }

  const handleSubmitResponse = async (feedbackId: string) => {
    if (!selectedFeedback || selectedFeedback.id !== feedbackId) {
      console.error('Invalid feedback ID')
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedFeedback: FeedbackItem = {
        ...selectedFeedback,
        response: selectedFeedback.message,
        responseDate: new Date().toISOString(),
        sentiment: {
          score: 0.5,
          label: 'neutral' as const,
          confidence: 0.8
        }
      }
      
      // Update the feedback in the state
      const updatedFeedbackList = feedback.map(f => 
        f.id === feedbackId ? updatedFeedback : f
      )
      setFeedback(updatedFeedbackList)
      
      // Update stats
      updateStats(updatedFeedbackList)
      
      // Add notification for response
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'feedback_response',
        message: `Response submitted for feedback from ${selectedFeedback.sender}`,
        date: new Date().toISOString(),
        isRead: false,
        relatedId: feedbackId
      }
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Clear selected feedback
      setSelectedFeedback(null)
    } catch (error) {
      console.error('Error submitting response:', error)
      setError('Failed to submit response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFeedback = async (feedbackData: { 
    message: string
    type: 'positive' | 'negative' | 'neutral'
    rating: number
    tags: string[]
    isPrivate: boolean
  }) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Determine sentiment based on type and rating
      let sentimentLabel: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
      let sentimentScore: number;
      
      if (feedbackData.type === 'positive') {
        sentimentLabel = feedbackData.rating >= 4 ? 'very_positive' : 'positive';
        sentimentScore = feedbackData.rating >= 4 ? 0.9 : 0.7;
      } else if (feedbackData.type === 'negative') {
        sentimentLabel = feedbackData.rating <= 2 ? 'very_negative' : 'negative';
        sentimentScore = feedbackData.rating <= 2 ? -0.9 : -0.7;
      } else {
        sentimentLabel = 'neutral';
        sentimentScore = 0;
      }
      
      const createdFeedback: FeedbackItem = {
        id: Date.now().toString(),
        sender: 'Current User',
        message: feedbackData.message,
        type: feedbackData.type,
        date: new Date().toISOString(),
        tags: feedbackData.tags,
        sentiment: {
          score: sentimentScore,
          label: sentimentLabel,
          confidence: 0.9
        },
        isPrivate: feedbackData.isPrivate,
        isRead: false
      }
      
      // Update the feedback in the state
      const updatedFeedbackList = [createdFeedback, ...feedback]
      setFeedback(updatedFeedbackList)
      
      // Update stats
      updateStats(updatedFeedbackList)
      
      // Update available tags
      updateAvailableTags(updatedFeedbackList)
      
      // Close the modal
      setShowNewFeedbackModal(false)
      
      // Add notification
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'new_feedback',
        message: `New ${feedbackData.type} feedback received`,
        date: new Date().toISOString(),
        isRead: false,
        relatedId: createdFeedback.id
      }
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    } catch (error) {
      console.error('Error creating feedback:', error)
      setError('Failed to create feedback')
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: FeedbackItem['sentiment'] | undefined) => {
    if (!sentiment?.label) return <MessageCircle className="w-5 h-5 text-gray-400" />;
    
    switch (sentiment.label) {
      case 'very_positive':
        return <Heart className="w-5 h-5 text-green-500" />
      case 'positive':
        return <Smile className="w-5 h-5 text-green-400" />
      case 'neutral':
        return <Meh className="w-5 h-5 text-yellow-400" />
      case 'negative':
        return <Frown className="w-5 h-5 text-orange-400" />
      case 'very_negative':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <MessageCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getSentimentColor = (sentiment: FeedbackItem['sentiment'] | undefined) => {
    if (!sentiment?.label) return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
    
    switch (sentiment.label) {
      case 'very_positive':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'positive':
        return 'bg-green-400/10 text-green-400 border-green-400/20'
      case 'neutral':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
      case 'negative':
        return 'bg-orange-400/10 text-orange-400 border-orange-400/20'
      case 'very_negative':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-400/20'
    }
  }

  const getActionItemStatusColor = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getActionItemPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'medium':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleCreateActionItem = (feedbackId: string) => {
    const feedbackItem = feedback.find(f => f.id === feedbackId);
    if (feedbackItem) {
      setSelectedFeedback(feedbackItem);
      setShowActionItemModal(true);
    }
  }

  const handleActionItemSubmit = (actionItem: {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (!selectedFeedback) return;
    
    const newActionItem: ActionItem = {
      id: Date.now().toString(),
      feedbackId: selectedFeedback.id,
      title: actionItem.title,
      description: actionItem.description,
      dueDate: actionItem.dueDate,
      status: 'pending',
      priority: actionItem.priority
    };
    
    // Update feedback with new action item
    const updatedFeedbackList = feedback.map(f => 
      f.id === selectedFeedback.id 
        ? { 
            ...f, 
            actionItems: [...(f.actionItems || []), newActionItem] 
          } 
        : f
    );
    
    setFeedback(updatedFeedbackList);
    
    // Update stats
    updateStats(updatedFeedbackList);
    
    // Add notification
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'action_item',
      message: `New action item created: ${actionItem.title}`,
      date: new Date().toISOString(),
      isRead: false,
      relatedId: selectedFeedback.id
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Close modal
    setShowActionItemModal(false);
    setSelectedFeedback(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  const filteredFeedback = feedback.filter(f => {
    const matchesSearch = f.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.sender.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === null || f.type === selectedType
    const matchesTags = selectedTags.length === 0 || f.tags.some(tag => selectedTags.includes(tag))

    return matchesSearch && matchesType && matchesTags
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Feedback</h2>
          <p className="text-gray-400">Manage and respond to feedback</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView(view === 'timeline' ? 'conversation' : 'timeline')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {view === 'timeline' ? (
              <>
                <MessageCircle className="w-4 h-4" />
                Switch to Conversation
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Switch to Timeline
              </>
            )}
          </button>
          <button
            onClick={() => setShowNewFeedbackModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            New Feedback
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Feedback</p>
              <p className="text-2xl font-semibold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Positive</p>
              <p className="text-2xl font-semibold text-white">{stats.positive}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ThumbsDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Negative</p>
              <p className="text-2xl font-semibold text-white">{stats.negative}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <CheckSquare className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Action Items</p>
              <p className="text-2xl font-semibold text-white">{stats.actionItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-white bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-lg",
              selectedType === null
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('positive')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-lg",
              selectedType === 'positive'
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            Positive
          </button>
          <button
            onClick={() => setSelectedType('negative')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-lg",
              selectedType === 'negative'
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            Negative
          </button>
          <button
            onClick={() => setSelectedType('neutral')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-lg",
              selectedType === 'neutral'
                ? "bg-yellow-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            Neutral
          </button>
        </div>
      </div>

      {/* Feedback List */}
      {view === 'conversation' ? (
        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-4 rounded-lg border",
                item.isRead ? "bg-gray-800/50 border-gray-700" : "bg-gray-800 border-purple-500/50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {item.sender?.charAt(0) || '?'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{item.sender}</h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        getSentimentColor(item.sentiment)
                      )}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="ml-1 capitalize">{item.sentiment?.label.replace('_', ' ')}</span>
                      </div>
                      {item.isPrivate && (
                        <span className="px-2 py-1 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300">{item.message}</p>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.actionItems && item.actionItems.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Action Items</h4>
                      <div className="space-y-2">
                        {item.actionItems.map((actionItem) => (
                          <div
                            key={actionItem.id}
                            className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-white">{actionItem.title}</h5>
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "px-2 py-1 text-xs font-medium rounded-full border",
                                  getActionItemStatusColor(actionItem.status)
                                )}>
                                  {actionItem.status.replace('_', ' ')}
                                </span>
                                <span className={cn(
                                  "px-2 py-1 text-xs font-medium rounded-full border",
                                  getActionItemPriorityColor(actionItem.priority)
                                )}>
                                  {actionItem.priority}
                                </span>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-400">{actionItem.description}</p>
                            <p className="mt-2 text-xs text-gray-500">
                              Due: {format(new Date(actionItem.dueDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!item.response && (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleCreateActionItem(item.id)}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Action Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {item.response && (
                <div className="mt-4 pl-14">
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Your Response</h4>
                      <p className="text-sm text-gray-400">
                        {formatDate(item.responseDate)}
                      </p>
                    </div>
                    <p className="text-gray-300">{item.response}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700" />
          <div className="space-y-8">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="relative pl-16">
                <div className="absolute left-8 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500" />
                <div className={cn(
                  "p-4 rounded-lg border",
                  item.isRead ? "bg-gray-800/50 border-gray-700" : "bg-gray-800 border-purple-500/50"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-white">{item.sender}</h3>
                      <p className="text-sm text-gray-400">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        getSentimentColor(item.sentiment)
                      )}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="ml-1 capitalize">{item.sentiment?.label.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">{item.message}</p>
                  {item.response && (
                    <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <p className="text-gray-300">{item.response}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 rounded-lg shadow-lg border max-w-md",
                notification.isRead
                  ? "bg-gray-800 border-gray-700"
                  : "bg-purple-900/50 border-purple-500/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {notification.type === 'new_feedback' && (
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  )}
                  {notification.type === 'feedback_response' && (
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  )}
                  {notification.type === 'action_item' && (
                    <CheckSquare className="w-5 h-5 text-yellow-500" />
                  )}
                  {notification.type === 'reminder' && (
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {format(new Date(notification.date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 