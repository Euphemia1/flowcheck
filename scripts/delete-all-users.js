// Node.js script to delete all users from Supabase
// Run with: node scripts/delete-all-users.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ppukriboyeeheujavzty.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWtyaWJveWVlaGV1amF2enR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjYxOTQsImV4cCI6MjA3Mjk0MjE5NH0.l0ry1vXUO2jrO7Ui6cZoTQzMzzIwYruRU6RO9ypXvhw'

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

