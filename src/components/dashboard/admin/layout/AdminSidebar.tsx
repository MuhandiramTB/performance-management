import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Shield,
  BarChart2,
  FileText,
  Bell,
  LogOut,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AdminSidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export function AdminSidebar({
  selectedTab,
  setSelectedTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: AdminSidebarProps) {
  const { signOut } = useAuth()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      bgColor: 'bg-[#6c47ff]/10',
      textColor: 'text-[#6c47ff]'
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Settings,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      id: 'roles-permissions',
      label: 'Roles & Permissions',
      icon: Shield,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400'
    }
  ]

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
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
                ? 'text-white bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
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

      <div className="p-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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