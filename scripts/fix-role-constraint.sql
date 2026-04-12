-- Fix role constraint issue for procurement migration
-- Run this in your Supabase SQL Editor

-- First, let's check what the current role constraint allows
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass AND conname = 'users_role_check';

-- Option 1: Drop the existing constraint and recreate it with procurement roles
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint that allows all procurement roles
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'manager', 'requester', 'finance', 'procurement', 'employee'));

-- Now update the roles safely
UPDATE users SET role = 'requester' WHERE role = 'employee';
UPDATE users SET role = 'manager' WHERE role = 'manager' AND role != 'requester';
UPDATE users SET role = 'admin' WHERE role = 'admin' AND role != 'requester';

-- Add procurement-specific users if they don't exist
INSERT INTO users (id, email, name, role, department, organization_id, organization_name, created_at) 
VALUES 
    (gen_random_uuid(), 'finance@flowcheck.com', 'Finance User', 'finance', 'Finance', (SELECT id FROM organizations LIMIT 1), (SELECT name FROM organizations LIMIT 1), NOW()),
    (gen_random_uuid(), 'procurement@flowcheck.com', 'Procurement User', 'procurement', 'Procurement', (SELECT id FROM organizations LIMIT 1), (SELECT name FROM organizations LIMIT 1), NOW())
ON CONFLICT (email) DO UPDATE SET 
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    updated_at = NOW();

-- Verify the role updates
SELECT role, COUNT(*) as user_count 
FROM users 
GROUP BY role 
ORDER BY role;
