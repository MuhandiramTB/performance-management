import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

// Create a single supabase client for interacting with your database
export const createClient = () => createClientComponentClient<Database>()

// For backward compatibility with existing code
export const supabase = createClientComponentClient<Database>()

// Server-side client creation function
export const createServerClient = (cookies: any) => createServerComponentClient<Database>({ cookies }) 