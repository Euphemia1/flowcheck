-- FlowCheck Procurement Database Schema
-- This script creates all necessary tables for the procurement workflow system

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS approval_steps CASCADE;
DROP TABLE IF EXISTS procurement_request_items CASCADE;
DROP TABLE IF EXISTS procurement_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with role-based access
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('requester', 'manager', 'finance', 'procurement', 'admin')),
    department VARCHAR(255),
    organization_id UUID REFERENCES organizations(id),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement Requests table
CREATE TABLE procurement_requests (
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

-- Procurement Request Items table
CREATE TABLE procurement_request_items (
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

-- Approval Steps table (workflow tracking)
CREATE TABLE approval_steps (
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

-- Purchase Orders table
CREATE TABLE purchase_orders (
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

-- Purchase Order Items table
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    request_item_id UUID NOT NULL REFERENCES procurement_request_items(id),
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Log table (comprehensive tracking)
CREATE TABLE audit_log (
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

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_procurement_requests_requester ON procurement_requests(requester_id);
CREATE INDEX idx_procurement_requests_status ON procurement_requests(status);
CREATE INDEX idx_procurement_requests_created_at ON procurement_requests(created_at);
CREATE INDEX idx_procurement_request_items_request ON procurement_request_items(request_id);
CREATE INDEX idx_approval_steps_request ON approval_steps(request_id);
CREATE INDEX idx_approval_steps_status ON approval_steps(status);
CREATE INDEX idx_approval_steps_approver ON approval_steps(approver_id);
CREATE INDEX idx_purchase_orders_request ON purchase_orders(request_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Organizations are viewable by everyone" ON organizations
    FOR SELECT USING (true);

CREATE POLICY "Users can insert organizations" ON organizations
    FOR INSERT WITH CHECK (true);

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view users in same organization" ON users
    FOR SELECT USING (organization_id IN (
        SELECT organization_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Procurement Requests policies
CREATE POLICY "Users can view their own requests" ON procurement_requests
    FOR SELECT USING (requester_id = auth.uid());

CREATE POLICY "Users can view requests they need to approve" ON procurement_requests
    FOR SELECT USING (id IN (
        SELECT request_id FROM approval_steps 
        WHERE approver_id = auth.uid() AND status = 'pending'
    ));

CREATE POLICY "Users can view approved requests in same organization" ON procurement_requests
    FOR SELECT USING (requester_id IN (
        SELECT id FROM users WHERE organization_id = (
            SELECT organization_id FROM users WHERE id = auth.uid()
        )
    ) AND status = 'approved');

CREATE POLICY "Users can create requests" ON procurement_requests
    FOR INSERT WITH CHECK (requester_id = auth.uid());

-- Procurement Request Items policies
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

-- Approval Steps policies
CREATE POLICY "Approvers can view their approval steps" ON approval_steps
    FOR SELECT USING (approver_id = auth.uid());

CREATE POLICY "Requesters can view approval steps for their requests" ON approval_steps
    FOR SELECT USING (request_id IN (
        SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
    ));

CREATE POLICY "Approvers can update their approval steps" ON approval_steps
    FOR UPDATE USING (approver_id = auth.uid());

-- Purchase Orders policies
CREATE POLICY "Users can view POs for their requests" ON purchase_orders
    FOR SELECT USING (request_id IN (
        SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
    ));

CREATE POLICY "Users can view POs they need to process" ON purchase_orders
    FOR SELECT USING (status IN ('pending', 'sent') AND (
        SELECT role FROM users WHERE id = auth.uid()
    ) IN ('procurement', 'finance'));

-- Purchase Order Items policies
CREATE POLICY "Users can view PO items for accessible POs" ON purchase_order_items
    FOR SELECT USING (po_id IN (
        SELECT id FROM purchase_orders WHERE request_id IN (
            SELECT id FROM procurement_requests WHERE requester_id = auth.uid()
        )
    ));

-- Audit Log policies (read-only for most users)
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

-- Admin policies (full access)
CREATE POLICY "Admins have full access to all tables" ON organizations
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON procurement_requests
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON procurement_request_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON approval_steps
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON purchase_orders
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON purchase_order_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access to all tables" ON audit_log
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
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procurement_requests_updated_at BEFORE UPDATE ON procurement_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procurement_request_items_updated_at BEFORE UPDATE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE TRIGGER update_total_on_item_insert AFTER INSERT ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_request_total_amount();

CREATE TRIGGER update_total_on_item_update AFTER UPDATE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION update_request_total_amount();

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

-- Create sequence for PO numbers
CREATE SEQUENCE IF NOT EXISTS po_sequence START 1;

-- Trigger for PO number generation
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
CREATE TRIGGER audit_organizations AFTER INSERT OR UPDATE OR DELETE ON organizations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_procurement_requests AFTER INSERT OR UPDATE OR DELETE ON procurement_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_procurement_request_items AFTER INSERT OR UPDATE OR DELETE ON procurement_request_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_approval_steps AFTER INSERT OR UPDATE OR DELETE ON approval_steps
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_purchase_orders AFTER INSERT OR UPDATE OR DELETE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_purchase_order_items AFTER INSERT OR UPDATE OR DELETE ON purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Insert sample data for testing
INSERT INTO organizations (name, domain, settings) VALUES 
('Acme Corporation', 'acme.com', '{"allowSelfRegistration": true, "defaultRole": "requester"}'),
('Tech Solutions Inc', 'techsolutions.com', '{"allowSelfRegistration": false, "defaultRole": "requester"}');

-- Insert sample users
INSERT INTO users (email, name, role, department, organization_id) VALUES 
('admin@acme.com', 'Admin User', 'admin', 'IT', (SELECT id FROM organizations WHERE domain = 'acme.com')),
('manager@acme.com', 'Manager User', 'manager', 'Operations', (SELECT id FROM organizations WHERE domain = 'acme.com')),
('finance@acme.com', 'Finance User', 'finance', 'Finance', (SELECT id FROM organizations WHERE domain = 'acme.com')),
('procurement@acme.com', 'Procurement User', 'procurement', 'Procurement', (SELECT id FROM organizations WHERE domain = 'acme.com')),
('employee@acme.com', 'Employee User', 'requester', 'Sales', (SELECT id FROM organizations WHERE domain = 'acme.com'));

-- Create view for pending approvals
CREATE VIEW pending_approvals AS
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
CREATE VIEW request_statistics AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
    COALESCE(SUM(total_amount), 0) as total_value,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'approved'), 0) as approved_value
FROM procurement_requests;

COMMIT;
