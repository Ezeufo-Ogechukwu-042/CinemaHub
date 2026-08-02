import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper to check if user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession()
  return !!data.session
}

// Helper to get current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}

// Helper to get current session
export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export default supabase