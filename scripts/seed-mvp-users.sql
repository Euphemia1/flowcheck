-- FlowCheck MVP role seed
-- Run after schema migration in Supabase SQL Editor.

DO $$
DECLARE
  org_id uuid;
BEGIN
  SELECT id INTO org_id FROM organizations ORDER BY created_at ASC LIMIT 1;

  IF org_id IS NULL THEN
    INSERT INTO organizations (name, domain, settings)
    VALUES (
      'FlowCheck Demo Org',
      'flowcheck.local',
      '{"allowSelfRegistration": true, "defaultRole": "requester"}'::jsonb
    )
    RETURNING id INTO org_id;
  END IF;

  INSERT INTO users (email, name, role, department, organization_id)
  VALUES
    ('employee@flowcheck.local', 'Employee Requester', 'requester', 'Operations', org_id),
    ('manager@flowcheck.local', 'Manager Approver', 'manager', 'Management', org_id),
    ('finance@flowcheck.local', 'Finance Approver', 'finance', 'Finance', org_id),
    ('director@flowcheck.local', 'Director Approver', 'admin', 'Management', org_id)
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    organization_id = EXCLUDED.organization_id,
    updated_at = NOW();
END $$;

SELECT email, name, role, department
FROM users
WHERE email IN (
  'employee@flowcheck.local',
  'manager@flowcheck.local',
  'finance@flowcheck.local',
  'director@flowcheck.local'
)
ORDER BY email;
