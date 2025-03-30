'use client'

import { useState } from 'react'
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface FeedbackStats {
  icon: React.ElementType
  label: string
  value: number
  bgColor: string
  iconColor: string
}

interface FeedbackItem {
  id: number
  author: {
    name: string
    role: string
    avatar: string
  }
  message: string
  timestamp: string
  status: 'Pending Response' | 'Responded'
  response?: string
}

export function Feedback() {
  const [feedbackResponse, setFeedbackResponse] = useState<string>('')

  const stats: FeedbackStats[] = [
    {
      icon: MessageSquare,
      label: 'Total Feedback',
      value: 156,
      bgColor: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Clock,
      label: 'Pending Review',
      value: 8,
      bgColor: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: 142,
      bgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    },
    {
      icon: AlertCircle,
      label: 'Overdue',
      value: 6,
      bgColor: 'bg-red-500/20',
      iconColor: 'text-red-400'
    }
  ]

  const recentFeedback: FeedbackItem[] = [
    {
      id: 1,
      author: {
        name: 'John Doe',
        role: 'Team Lead',
        avatar: 'J'
      },
      message: 'Great work on the recent project! Your attention to detail and problem-solving skills were exceptional. Keep up the excellent work.',
      timestamp: '2 hours ago',
      status: 'Pending Response'
    },
    {
      id: 2,
      author: {
        name: 'Jane Smith',
        role: 'Project Manager',
        avatar: 'J'
      },
      message: 'Your leadership in the team training sessions has been invaluable. The team\'s productivity has significantly improved thanks to your efforts.',
      timestamp: '5 hours ago',
      status: 'Responded',
      response: 'Thank you for the feedback! I\'m glad I could contribute to the team\'s growth.'
    }
  ]

  const handleSubmitResponse = (feedbackId: number) => {
    if (!feedbackResponse.trim()) return

    // Update the feedback item with the response
    // This would typically involve an API call
    console.log('Submitting response for feedback:', feedbackId, feedbackResponse)
    setFeedbackResponse('')
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#151524] rounded-lg p-6 flex flex-col"
          >
            <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <span className="text-sm text-gray-400">{stat.label}</span>
            <span className="text-3xl font-semibold text-white mt-1">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Recent Feedback Section */}
      <div className="bg-[#151524] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Feedback</h2>
        <div className="space-y-8">
          {recentFeedback.map((feedback) => (
            <div key={feedback.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#6c47ff] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">{feedback.author.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{feedback.author.name}</h3>
                      <p className="text-sm text-gray-400">
                        {feedback.author.role} • {feedback.timestamp}
                      </p>
                    </div>
                    <span className={`text-sm ${
                      feedback.status === 'Responded' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-300">{feedback.message}</p>
                  
                  {feedback.response ? (
                    <div className="mt-4 pl-4 border-l-2 border-gray-800">
                      <p className="text-gray-400">{feedback.response}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <textarea
                        placeholder="Add your response..."
                        value={feedbackResponse}
                        onChange={(e) => setFeedbackResponse(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1E293B] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] resize-none"
                        rows={4}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleSubmitResponse(feedback.id)}
                          disabled={!feedbackResponse.trim()}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#6c47ff] rounded-lg hover:bg-[#5a3dd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 