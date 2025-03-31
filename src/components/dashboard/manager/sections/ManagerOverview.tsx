'use client'

import { Users, Target, TrendingUp, Clock, BarChart2 } from 'lucide-react'
import { useState } from 'react'

interface TeamMetric {
  label: string
  value: string | number
  change: number
  icon: React.ElementType
  bgColor: string
  iconColor: string
}

export function ManagerOverview() {
  const [teamMetrics, setTeamMetrics] = useState<TeamMetric[]>([])
  const [performanceData, setPerformanceData] = useState<Array<{ name: string; performance: number; goals: number }>>([])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Manager Overview</h1>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[#151524] rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`${metric.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
                <h3 className="text-sm text-gray-400">{metric.label}</h3>
                <p className="text-2xl font-semibold text-white mt-1">{metric.value}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-sm ${
                metric.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Performance */}
      <div className="bg-[#151524] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Team Performance</h2>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Last 30 days</span>
          </div>
        </div>
        <div className="space-y-6">
          {performanceData.map((team, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{team.name}</span>
                <span className="text-white font-medium">{team.performance}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6c47ff] rounded-full"
                  style={{ width: `${team.performance}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Goals Completed: {team.goals}</span>
                <span className="text-gray-500">Target: 50</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 