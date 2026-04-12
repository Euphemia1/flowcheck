-- Migration script to add procurement workflow tables to existing FlowCheck database
-- Run this in your Supabase SQL Editor

-- First, let's check what tables already exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Add procurement-specific tables to the existing database

-- 1. Procurement Requests table
CREATE TABLE IF NOT EXISTS procurement_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requester_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'cancelled')),
    total_amount DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    urgency_level VARCHAR(20) DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
    expected_delivery_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Procurement Request Items table
CREATE TABLE IF NOT EXISTS procurement_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES procurement_requests(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    category VARCHAR(100),
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Approval Steps table (workflow tracking)
CREATE TABLE IF NOT EXISTS approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES procurement_requests(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    approver_role VARCHAR(50) NOT NULL,
    approver_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
    comments TEXT,
    actioned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, step_order)
);

-- 4. Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    request_id UUID NOT NULL REFERENCES procurement_requests(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'fulfilled', 'cancelled')),
    vendor_name VARCHAR(255),
    vendor_email VARCHAR(255),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Purchase Order Items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    request_item_id UUID NOT NULL REFERENCES procurement_request_items(id),
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Audit Log table (comprehensive tracking)
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'request', 'approval_step', 'purchase_order', 'user'
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'created', 'updated', 'approved', 'rejected', 'cancelled', etc.
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Update existing users table to support procurement roles
DO $$ 
BEGIN
    -- First, drop any existing role constraint to allow updates
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.users'::regclass AND conname = 'users_role_check') THEN
        ALTER TABLE users DROP CONSTRAINT users_role_check;
    END IF;
    
    -- Update role column to support procurement-specific roles
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        -- Update existing role values to match procurement roles
        UPDATE users SET role = 'requester' WHERE role = 'employee';
        UPDATE users SET role = 'manager' WHERE role = 'manager' AND role != 'requester';
        UPDATE users SET role = 'admin' WHERE role = 'admin' AND role != 'requester';
        
        -- Add new constraint that allows all procurement roles
        ALTER TABLE users ADD CONSTRAINT users_role_check 
        CHECK (role IN ('admin', 'manager', 'requester', 'finance', 'procurement', 'employee'));
    END IF;
END $$;

-- Add department column if it doesn't exist (for role-based routing)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'department'
    ) THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(255);
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_procurement_requests_requester ON procurement_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_procurement_requests_status ON procurement_requests(status);
CREATE INDEX IF NOT EXISTS idx_procurement_requests_created_at ON procurement_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_procurement_request_items_request ON procurement_request_items(request_id);
CREATE INDEX IF NOT EXISTS idx_approval_steps_request ON approval_steps(request_id);
CREATE INDEX IF NOT EXISTS idx_approval_steps_status ON approval_steps(status);
CREATE INDEX IF NOT EXISTS idx_approval_steps_approver ON approval_steps(approver_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_request ON purchase_orders(request_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for procurement requests
CREATE POLICY "Users can view their own requests" ON procurement_requests
    FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "Users can view requests they need to approve" ON procurement_requests
    FOR SELECT USING (id IN (
        SELECT request_id FROM approval_steps 
        WHERE approver_id = auth.uid() AND status = 'pending'
    ));

CREATE POLICY "Users can create requests" ON procurement_requests
    FOR INSERT WITH CHECK (requester_id = auth.uid());

-- Create RLS policies for procurement request items
CREATE POLICY "Users can view items for their requests" ON procurement_request_items
    FOR SELECT USING (request_id IN (
        SELECT id FROM procurement_requests 
        WHERE requester_id = auth.uid() OR id IN (
            SELECT request_id FROM approval_steps 
            WHERE approver_id = auth.uid()
        )
    ));

CREATE POLICY "Users can insert items for their requests" ON procurement_request_items
    FOR INSERT WITH CHECK (request_id IN (
        SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
    ));

-- Create RLS policies for approval steps
CREATE POLICY "Approvers can view their approval steps" ON approval_steps
    FOR SELECT USING (approver_id = auth.uid());

CREATE POLICY "Requesters can view approval steps for their requests" ON approval_steps
    FOR SELECT USING (request_id IN (
        SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
    ));

CREATE POLICY "Approvers can update their approval steps" ON approval_steps
    FOR UPDATE USING (approver_id = auth.uid());

-- Create RLS policies for purchase orders
CREATE POLICY "Users can view POs for their requests" ON purchase_orders
    FOR SELECT USING (request_id IN (
        SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
    ));

-- Create RLS policies for purchase order items
CREATE POLICY "Users can view PO items for accessible POs" ON purchase_order_items
    FOR SELECT USING (po_id IN (
        SELECT id FROM purchase_orders WHERE request_id IN (
            SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
        )
    ));

-- Create RLS policies for audit log (read-only for most users)
CREATE POLICY "Users can view audit logs for their entities" ON audit_log
    FOR SELECT USING (
        (entity_type = 'request' AND entity_id IN (
            SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
        )) OR
        (entity_type = 'approval_step' AND entity_id IN (
            SELECT id FROM approval_steps WHERE approver_id = auth.uid()
        )) OR
        user_id = auth.uid()
    );

-- Admin policies (full access for admins)
CREATE POLICY "Admins have full access to procurement tables" ON procurement_requests
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to procurement tables" ON procurement_request_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to procurement tables" ON approval_steps
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to procurement tables" ON purchase_orders
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to procurement tables" ON purchase_order_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to procurement tables" ON audit_log
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_procurement_requests_updated_at ON procurement_requests;
CREATE TRIGGER update_procurement_requests_updated_at BEFORE UPDATE ON procurement_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procurement_request_items_updated_at ON procurement_request_items;
CREATE TRIGGER update_procurement_request_items_updated_at BEFORE UPDATE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchase_orders_updated_at ON purchase_orders;
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update request total_amount
CREATE OR REPLACE FUNCTION update_request_total_amount()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE procurement_requests 
    SET total_amount = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM procurement_request_items 
        WHERE request_id = COALESCE(NEW.request_id, OLD.request_id)
    )
    WHERE id = COALESCE(NEW.request_id, OLD.request_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for automatic total amount calculation
DROP TRIGGER IF EXISTS update_total_on_item_insert ON procurement_request_items;
CREATE TRIGGER update_total_on_item_insert AFTER INSERT ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_request_total_amount();

DROP TRIGGER IF EXISTS update_total_on_item_update ON procurement_request_items;
CREATE TRIGGER update_total_on_item_update AFTER UPDATE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_request_total_amount();

DROP TRIGGER IF EXISTS update_total_on_item_delete ON procurement_request_items;
CREATE TRIGGER update_total_on_item_delete AFTER DELETE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_request_total_amount();

-- Function to generate PO number
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.po_number = 'PO-' || LPAD(EXTRACT(MONTH FROM NOW())::text, 2, '0') || 
                    LPAD(EXTRACT(DAY FROM NOW())::text, 2, '0') || '-' ||
                    LPAD(nextval('po_sequence')::text, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for PO numbers if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS po_sequence START 1;

-- Trigger for PO number generation
DROP TRIGGER IF EXISTS generate_po_number_trigger ON purchase_orders;
CREATE TRIGGER generate_po_number_trigger BEFORE INSERT ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION generate_po_number();

-- Function to log audit changes
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        entity_type,
        entity_id,
        action,
        old_values,
        new_values,
        user_id,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
        auth.uid(),
        inet_client_addr(),
        current_setting('request.headers')::json->>'user-agent',
        json_build_object('table', TG_TABLE_NAME, 'operation', TG_OP)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create audit triggers
DROP TRIGGER IF EXISTS audit_procurement_requests ON procurement_requests;
CREATE TRIGGER audit_procurement_requests AFTER INSERT OR UPDATE OR DELETE ON procurement_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_procurement_request_items ON procurement_request_items;
CREATE TRIGGER audit_procurement_request_items AFTER INSERT OR UPDATE OR DELETE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_approval_steps ON approval_steps;
CREATE TRIGGER audit_approval_steps AFTER INSERT OR UPDATE OR DELETE ON approval_steps
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_purchase_orders ON purchase_orders;
CREATE TRIGGER audit_purchase_orders AFTER INSERT OR UPDATE OR DELETE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_purchase_order_items ON purchase_order_items;
CREATE TRIGGER audit_purchase_order_items AFTER INSERT OR UPDATE OR DELETE ON purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create view for pending approvals
CREATE OR REPLACE VIEW pending_approvals AS
SELECT 
    pr.id,
    pr.title,
    pr.total_amount,
    pr.created_at,
    pr.urgency_level,
    u.name as requester_name,
    u.email as requester_email,
    ast.step_order,
    ast.approver_role,
    ast.id as approval_step_id
FROM procurement_requests pr
JOIN approval_steps ast ON pr.id = ast.request_id
JOIN users u ON pr.requester_id = u.id
WHERE ast.status = 'pending' AND pr.status = 'pending'
ORDER BY pr.created_at ASC;

-- Create view for request statistics
CREATE OR REPLACE VIEW request_statistics AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
    COALESCE(SUM(total_amount), 0) as total_value,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'approved'), 0) as approved_value
FROM procurement_requests;

-- Create sample procurement users if they don't exist
-- Check if organization_name column exists first
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'organization_name'
    ) THEN
        INSERT INTO users (id, email, name, role, department, organization_id, organization_name, created_at) 
        VALUES 
            (gen_random_uuid(), 'finance@flowcheck.com', 'Finance User', 'finance', 'Finance', (SELECT id FROM organizations LIMIT 1), (SELECT name FROM organizations LIMIT 1), NOW()),
            (gen_random_uuid(), 'procurement@flowcheck.com', 'Procurement User', 'procurement', 'Procurement', (SELECT id FROM organizations LIMIT 1), (SELECT name FROM organizations LIMIT 1), NOW())
        ON CONFLICT (email) DO NOTHING;
    ELSE
        INSERT INTO users (id, email, name, role, department, organization_id, created_at) 
        VALUES 
            (gen_random_uuid(), 'finance@flowcheck.com', 'Finance User', 'finance', 'Finance', (SELECT id FROM organizations LIMIT 1), NOW()),
            (gen_random_uuid(), 'procurement@flowcheck.com', 'Procurement User', 'procurement', 'Procurement', (SELECT id FROM organizations LIMIT 1), NOW())
        ON CONFLICT (email) DO NOTHING;
    END IF;
END $$;

-- Verify the migration
SELECT 'Migration completed successfully!' as status,
       (SELECT COUNT(*) FROM procurement_requests) as procurement_requests_count,
       (SELECT COUNT(*) FROM approval_steps) as approval_steps_count,
       (SELECT COUNT(*) FROM purchase_orders) as purchase_orders_count,
       (SELECT COUNT(*) FROM audit_log) as audit_log_count;
