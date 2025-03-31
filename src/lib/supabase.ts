import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set'
  )
}

// Create a single supabase client for interacting with your database in the browser
export const createClient = () => {
  // Only create client if we're in the browser
  if (typeof window === 'undefined') {
    return null
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// For backward compatibility with existing code
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null 