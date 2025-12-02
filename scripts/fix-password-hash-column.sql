-- Fix the password_hash column issue
-- Since we're using Supabase Auth, we don't need to store passwords in the users table
-- Supabase Auth handles password storage in auth.users table

-- Option 1: Make password_hash column nullable (Recommended)
-- This allows the column to exist but doesn't require it
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Option 2: Remove the password_hash column entirely (if you don't need it)
-- Uncomment the line below if you want to remove the column completely
-- ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Option 3: If you want to keep it required, you can set a default value
-- (Not recommended since passwords should be hashed differently per user)
-- ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'password_hash';

