-- Demo procurement users: dedicated requester + finance approver
-- Run in Supabase SQL Editor (same project as the app).
--
-- After this script:
--   1. POST /api/auth/seed-users  (needs SUPABASE_SERVICE_ROLE_KEY on the server)
--   Default password for newly created auth users: Test@123!
--
-- Workflow notes:
--   - Requests $500–$4,999: manager → finance (see app/api/procurement/requests/route.ts)
--   - Ensure you have a manager (or admin) in the same organization for step 1.
--   - If multiple users have role "finance", the API picks the oldest by created_at.
--     To use only this finance user, avoid extra "finance" rows or adjust roles on older users.

DO $$
DECLARE
  org_id uuid;
  org_name text;
BEGIN
  SELECT id, name INTO org_id, org_name
 FROM organizations
  ORDER BY created_at ASC
  LIMIT 1;

  IF org_id IS NULL THEN
    RAISE EXCEPTION 'No organization found. Create an organization first.';
  END IF;

  INSERT INTO users (email, name, role, department, organization_id)
  VALUES
    (
      'demo.requester@flowcheck.demo',
      'Morgan Okonkwo',
      'requester',
      'Operations',
      org_id
    ),
    (
      'demo.finance@flowcheck.demo',
      'Aisha Nkonde',
      'finance',
      'Finance',
      org_id
    )
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    organization_id = EXCLUDED.organization_id,
    updated_at = NOW();

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'organization_name'
  ) THEN
    UPDATE users
    SET organization_name = org_name
    WHERE email IN (
      'demo.requester@flowcheck.demo',
      'demo.finance@flowcheck.demo'
    );
  END IF;
END $$;

SELECT id, email, name, role, department, organization_id
FROM users
WHERE email IN (
  'demo.requester@flowcheck.demo',
  'demo.finance@flowcheck.demo'
)
ORDER BY email;
