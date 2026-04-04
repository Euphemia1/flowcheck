-- SQL Query to add test users for each department
-- Run this in your Supabase SQL Editor

-- First, get the organization_id from your existing organization
DO $$
DECLARE
  org_id uuid;
BEGIN
  SELECT id INTO org_id FROM organizations LIMIT 1;
  
  INSERT INTO users (
    id, email, name, role, department, hierarchy_level, position, 
    organization_id, status, permissions, created_at, updated_at
  )
  VALUES
    -- Finance Department
    (gen_random_uuid(), 'finance.manager@flowcheck.com', 'Mapalo Chikungulu', 'manager', 'Finance', 2, 'Finance Manager', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'finance.approver@flowcheck.com', 'Kunda Chikungulu', 'manager', 'Finance', 3, 'Finance Approver', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'finance.employee@flowcheck.com', 'Princess Chikungulu', 'employee', 'Finance', 4, 'Finance Officer', org_id, 'active', '{}', NOW(), NOW()),
    
    -- HR Department
    (gen_random_uuid(), 'hr.manager@flowcheck.com', 'Samson Chikungulu', 'manager', 'HR', 2, 'HR Manager', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'hr.approver@flowcheck.com', 'Veronica Chikungulu', 'manager', 'HR', 3, 'HR Approver', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'hr.employee@flowcheck.com', 'Chipapa Chikungulu', 'employee', 'HR', 4, 'HR Specialist', org_id, 'active', '{}', NOW(), NOW()),
    
    -- Operations Department
    (gen_random_uuid(), 'operations.manager@flowcheck.com', 'Kalonde Chikungulu', 'manager', 'Operations', 2, 'Operations Manager', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'operations.approver@flowcheck.com', 'Chiti Chikungulu', 'manager', 'Operations', 3, 'Operations Approver', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'operations.employee@flowcheck.com', 'Jemini Chikungulu', 'employee', 'Operations', 4, 'Operations Coordinator', org_id, 'active', '{}', NOW(), NOW()),
    
    -- Procurement Department
    (gen_random_uuid(), 'procurement.manager@flowcheck.com', 'Wazama Nyirenda', 'manager', 'Procurement', 2, 'Procurement Manager', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'procurement.approver@flowcheck.com', 'Chishimba Chipulu', 'manager', 'Procurement', 3, 'Procurement Approver', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'procurement.employee@flowcheck.com', 'Emmanuel Chikungulu', 'employee', 'Procurement', 4, 'Procurement Officer', org_id, 'active', '{}', NOW(), NOW()),
    
    -- Management Department
    (gen_random_uuid(), 'management.manager@flowcheck.com', 'Felistus Chikungulu', 'manager', 'Management', 2, 'Management Lead', org_id, 'active', '{}', NOW(), NOW()),
    (gen_random_uuid(), 'management.employee@flowcheck.com', 'Musaba Kunda', 'employee', 'Management', 4, 'Management Specialist', org_id, 'active', '{}', NOW(), NOW())
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    updated_at = NOW();
    
  RAISE NOTICE 'Department users created successfully';
END $$;

-- Verify the users were created
SELECT email, name, role, department, hierarchy_level FROM users ORDER BY department, hierarchy_level;
