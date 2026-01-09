/**
 * Supabase Client Configuration - F006
 * [INPUT]: Environment variables
 * [OUTPUT]: Configured Supabase client with realtime
 * [POS]: Service Layer - Database Connection
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
} else {
  console.warn('Supabase credentials not found. Room features will be disabled.')
  
  supabaseClient = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => ({ data: [], error: { message: 'Supabase not configured' } })
        }),
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
          })
        })
      }),
      delete: () => ({
        eq: async () => ({ error: { message: 'Supabase not configured' } })
      })
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => {}
      })
    }),
    removeChannel: () => {}
  }
}

export const supabase = supabaseClient

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
