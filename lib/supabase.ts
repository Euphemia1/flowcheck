
import { createClient } from '@supabase/supabase-js'
// Supabase project URL (extracted from anon key: ref is ppukriboyeeheujavzty)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

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

