import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Shield,
  BarChart2,
  Building2,
  History,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AdminSidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

export function AdminSidebar({
  selectedTab,
  setSelectedTab,
}: AdminSidebarProps) {
  const { signOut } = useAuth()

  const menuItems = [
    
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Settings,
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400'
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: History,
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400'
    },
    {
      id: 'reports',
      label: 'Analytics',
      icon: BarChart2,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    }
  ]

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200
              ${selectedTab === item.id
                ? 'text-white bg-[#1a1a2e]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a2e]'
              }
            `}
          >
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.textColor}`} />
            </div>
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800/50">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1a1a2e] rounded-lg transition-colors"
        >
          <div className="p-2 rounded-lg bg-red-500/10">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          Logout
        </button>
      </div>
    </div>
  )
} 