# Supabase Database Setup Guide

## Common Issues and Solutions

### Issue: Users are not being saved to the database

This usually happens due to one of these reasons:

#### 1. Row Level Security (RLS) Policies

If RLS is enabled on your `users` table, you need to create policies to allow inserts.

**Solution:** Run this SQL in your Supabase SQL Editor:

```sql
-- Allow inserts for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow service role to insert (for API routes)
CREATE POLICY "Allow service role insert" ON users
FOR INSERT
TO service_role
WITH CHECK (true);

-- Or disable RLS temporarily for testing (NOT recommended for production)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

#### 2. Missing or Incorrect Column Names

Make sure your `users` table has these columns:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'employee',
  organization_id TEXT,
  organization_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. Check Your Table Schema

Run this to see your current table structure:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';
```

## Required Columns

Your `users` table should have at least:
- `id` (UUID) - Primary key, should match auth.users(id)
- `email` (TEXT) - User's email address
- `full_name` (TEXT) - User's full name
- `role` (TEXT) - User role (admin, manager, employee)
- `organization_id` (TEXT) - Optional
- `organization_name` (TEXT) - Optional
- `created_at` (TIMESTAMPTZ) - Creation timestamp

## Testing

After setting up, test by:

1. **Check if RLS is enabled:**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';
```

2. **Test insert directly:**
```sql
INSERT INTO users (id, email, full_name, role, created_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  'employee',
  NOW()
);
```

3. **Check for errors in your API logs** - The registration route now returns detailed error messages.

## Quick Fix: Disable RLS (for development only)

⚠️ **Warning:** Only do this for development/testing!

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

For production, create proper RLS policies instead.

