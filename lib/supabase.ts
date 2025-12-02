
import { createClient } from '@supabase/supabase-js'
// Supabase project URL (extracted from anon key: ref is ppukriboyeeheujavzty)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ppukriboyeeheujavzty.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWtyaWJveWVlaGV1amF2enR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjYxOTQsImV4cCI6MjA3Mjk0MjE5NH0.l0ry1vXUO2jrO7Ui6cZoTQzMzzIwYruRU6RO9ypXvhw'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Server-side Supabase client for API routes
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

