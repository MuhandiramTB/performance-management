import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'employee'
          department: string | null
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'employee'
          department?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'employee'
          department?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          employee_id: string
          manager_id: string
          description: string
          status: 'draft' | 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
          period_start: string
          period_end: string
        }
        Insert: {
          id?: string
          employee_id: string
          manager_id: string
          description: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
          period_start: string
          period_end: string
        }
        Update: {
          id?: string
          employee_id?: string
          manager_id?: string
          description?: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
          period_start?: string
          period_end?: string
        }
      }
      ratings: {
        Row: {
          id: string
          goal_id: string
          employee_rating: number | null
          manager_rating: number | null
          employee_feedback: string | null
          manager_feedback: string | null
          submitted_at: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          goal_id: string
          employee_rating?: number | null
          manager_rating?: number | null
          employee_feedback?: string | null
          manager_feedback?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          goal_id?: string
          employee_rating?: number | null
          manager_rating?: number | null
          employee_feedback?: string | null
          manager_feedback?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: any | null
          created_at?: string
        }
      }
    }
  }
} 