import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from './page'

export default async function AdminDashboardLayout() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!user || user.role !== 'admin') {
    redirect('/dashboard')
  }

  return <AdminDashboard />
} 