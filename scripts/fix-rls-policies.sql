-- Fix Row Level Security (RLS) policies for the users table
-- Run this in your Supabase SQL Editor

-- Option 1: DISABLE RLS (Easiest for development/testing)
-- ⚠️ WARNING: Only use this for development! Not recommended for production.
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Option 2: ENABLE RLS but allow all operations (Recommended)
-- First, make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts (for user registration)
CREATE POLICY "Allow insert for anyone" ON users
FOR INSERT
TO public
WITH CHECK (true);

-- Create a policy to allow reads (for login)
CREATE POLICY "Allow read for anyone" ON users
FOR SELECT
TO public
USING (true);

-- Create a policy to allow updates (users can update their own records)
CREATE POLICY "Allow update for own user" ON users
FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Option 3: Allow service role to bypass RLS (for API routes)
-- This is useful if you're using service role key in API routes
-- Note: You'll need to use service role key instead of anon key for this to work

-- To check if RLS is enabled:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- To see existing policies:
SELECT * FROM pg_policies WHERE tablename = 'users';

