// Quick script to delete all users from Supabase
// Run with: node scripts/delete-users.js

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function deleteAllUsers() {
  try {
    console.log('🔍 Checking users in database...')

    // First check how many users exist
    const { data: users, error: fetchError, count } = await supabase
      .from('users')
      .select('id, email, full_name', { count: 'exact' })

    if (fetchError) {
      console.error('❌ Error:', fetchError.message)
      console.log('\n💡 Make sure your table is named "users"')
      return
    }

    if (!users || users.length === 0) {
      console.log('✅ No users found - database is already empty!')
      return
    }

    console.log(`\n📊 Found ${users.length} user(s) to delete:`)
    users.forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.email} - ${user.full_name || 'No name'}`)
    })

    // Delete all users - get all IDs first, then delete them
    const userIds = users.map(u => u.id)

    // Delete in batches if needed (Supabase has limits)
    const batchSize = 100
    let deletedCount = 0

    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .in('id', batch)

      if (deleteError) {
        console.error('❌ Delete error:', deleteError.message)
        return
      }
      deletedCount += batch.length
      console.log(`   Deleted ${deletedCount}/${userIds.length}...`)
    }

    console.log(`\n✅ Successfully deleted ${users.length} user(s)!`)

    // Verify
    const { count: remaining } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Remaining users: ${remaining || 0}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

deleteAllUsers()

