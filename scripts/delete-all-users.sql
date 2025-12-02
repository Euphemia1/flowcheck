-- SQL script to delete all users from the users table
-- WARNING: This will permanently delete all users!
-- Run this in your Supabase SQL Editor

-- Option 1: Delete from users table (if you have a users table)
DELETE FROM users;

-- Option 2: If your table has a different name, replace "users" with your table name
-- For example: DELETE FROM profiles;
-- Or: DELETE FROM user_profiles;

-- Option 3: If you also want to delete from Supabase Auth (auth.users table)
-- WARNING: This requires admin privileges and will delete auth records too
-- DELETE FROM auth.users;

-- To verify the deletion worked, you can run:
-- SELECT COUNT(*) FROM users;

