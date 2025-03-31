import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Create a single supabase client for interacting with your database in the browser
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// For backward compatibility with existing code
export const supabase = createClient() 