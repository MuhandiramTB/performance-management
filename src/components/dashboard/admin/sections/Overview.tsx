interface OverviewProps {
  onBack: () => void
}

export function Overview({ onBack }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2.5 text-gray-400 hover:text-white transition-colors rounded-lg bg-[#252a3d] hover:bg-[#2f3548]"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-white">Dashboard Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1b2e] p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-[#6c47ff]">156</p>
        </div>
        <div className="bg-[#1a1b2e] p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-[#4CAF50]">24</p>
        </div>
        <div className="bg-[#1a1b2e] p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">System Status</h3>
          <p className="text-3xl font-bold text-[#6c47ff]">Healthy</p>
        </div>
      </div>
    </div>
  )
} 