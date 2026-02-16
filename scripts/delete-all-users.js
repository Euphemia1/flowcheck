// Node.js script to delete all users from Supabase
// Run with: node scripts/delete-all-users.js

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function deleteAllUsers() {
  try {
    console.log('🔍 Fetching all users...')

    // First, get all users to see how many there are
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, email, full_name')

    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError.message)
      console.log('\n💡 Tip: The table might have a different name.')
      console.log('   Common table names: users, profiles, user_profiles')
      return
    }

    if (!users || users.length === 0) {
      console.log('✅ No users found in the database.')
      return
    }

    console.log(`\n📊 Found ${users.length} user(s):`)
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} - ${user.full_name || 'No name'}`)
    })

    console.log(`\n⚠️  About to delete ${users.length} user(s)...`)

    // Delete all users
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // This will match all rows

    if (deleteError) {
      console.error('❌ Error deleting users:', deleteError.message)
      return
    }

    console.log(`\n✅ Successfully deleted ${users.length} user(s)!`)

    // Verify deletion
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    console.log(`\n📊 Remaining users in database: ${count || 0}`)

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the function
deleteAllUsers()

