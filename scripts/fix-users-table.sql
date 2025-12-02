-- SQL script to check and fix the users table structure
-- Run this in your Supabase SQL Editor

-- First, check what columns your users table currently has
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Option 1: Add the missing 'full_name' column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE users ADD COLUMN full_name TEXT;
        RAISE NOTICE 'Added full_name column';
    ELSE
        RAISE NOTICE 'full_name column already exists';
    END IF;
END $$;

-- Option 2: If you already have a 'name' column and want to use that instead,
-- you can rename it to 'full_name' (uncomment if needed):
-- ALTER TABLE users RENAME COLUMN name TO full_name;

-- Also ensure other required columns exist
DO $$ 
BEGIN
    -- Add role column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'employee';
    END IF;
    
    -- Add organization_id if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'organization_id'
    ) THEN
        ALTER TABLE users ADD COLUMN organization_id TEXT;
    END IF;
    
    -- Add organization_name if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'organization_name'
    ) THEN
        ALTER TABLE users ADD COLUMN organization_name TEXT;
    END IF;
    
    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

