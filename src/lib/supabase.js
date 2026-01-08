/**
 * Supabase Client Configuration - F006
 * [INPUT]: Environment variables
 * [OUTPUT]: Configured Supabase client with realtime
 * [POS]: Service Layer - Database Connection
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Room features will be disabled.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
