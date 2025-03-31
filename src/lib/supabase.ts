import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Get environment variables with fallbacks for static page generation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with your database in the browser
export const createClient = () => {
  // Only create client if we're in the browser and have valid environment variables
  if (typeof window === 'undefined' || !supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// For backward compatibility with existing code
export const supabase = typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null 