
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ""
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("your-project-ref") &&
  !supabaseAnonKey.includes("your-anon-key")
export const isSupabaseAdminConfigured =
  isSupabaseConfigured && Boolean(supabaseServiceRoleKey)

// Server-side Supabase client for API routes
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
  {
    auth: {
      persistSession: false,
    },
  }
)

// Admin client for privileged server-side operations only.
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceRoleKey || "placeholder",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

