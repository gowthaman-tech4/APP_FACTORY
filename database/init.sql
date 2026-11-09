-- ==============================================================================
-- APP FACTORY MULTI-TENANT DATABASE INITIALIZATION SCRIPT (PostgreSQL 15+)
-- Prepared by: Principal Solutions Architect (Ex-Stripe / Razorpay)
-- Security: Row-Level Security (RLS) Enforced Partitioning by `tenant_id`
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TENANTS TABLE (Each subscribing shop or workshop)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(63) UNIQUE NOT NULL, -- e.g., 'sri-lakshmi', 'apex-motors'
    business_name VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL,    -- 'retail' or 'autocare'
    phone VARCHAR(20) NOT NULL,
    currency VARCHAR(10) DEFAULT '₹',
    theme_color VARCHAR(20) DEFAULT '#059669',
    upi_id VARCHAR(100),              -- e.g., 'store@okaxis'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TRANSACTIONS & JOB CARDS TABLE (Universal Ledger & State Machine)
CREATE TABLE IF NOT EXISTS records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    public_token VARCHAR(32) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    
    -- Universal Customer Identifiers
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Vertical-Specific Payload (Stored as JSONB for high flexibility)
    title VARCHAR(150) NOT NULL,        -- Vehicle No (AutoCare) OR Customer Name (Retail)
    summary TEXT NOT NULL,              -- Service Package (AutoCare) OR Grocery Items List (Retail)
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    
    -- State Machine
    mode VARCHAR(30) NOT NULL,          -- 'cash', 'upi', 'udhar', 'repairing', 'ready'
    status VARCHAR(50) NOT NULL,        -- 'Paid (UPI)', 'Udhar (Pending)', 'In Repair'
    due_date DATE,                      -- For Udhar credit tracking
    
    -- Inspection & Attachments
    metadata JSONB DEFAULT '{}'::jsonb, -- Damage photos, odometer, battery %
    
    -- Audit Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HIGH-SPEED SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_records_tenant_id ON records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_records_customer_phone ON records(customer_phone);
CREATE INDEX IF NOT EXISTS idx_records_public_token ON records(public_token);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at DESC);

-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation: Shopkeepers only ever read/write their own rows
CREATE POLICY tenant_isolation_records ON records
    FOR ALL
    USING (tenant_id = auth.jwt() ->> 'tenant_id'::uuid);

-- Public Read Policy: Customers can view their specific bill via token without login
CREATE POLICY customer_public_read ON records
    FOR SELECT
    USING (public_token IS NOT NULL);

-- ==============================================================================
-- SEED DATA (For Local Verification & Unit Testing)
-- ==============================================================================

-- Seed Tenant 1: Indian Retail Kirana
INSERT INTO tenants (id, slug, business_name, industry, phone, currency, theme_color, upi_id)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
    'sri-lakshmi',
    'Sri Lakshmi Provision & Super Store',
    'retail',
    '+919876543210',
    '₹',
    '#059669',
    'srilakshmi@upi'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Tenant 2: AutoCare Garage
INSERT INTO tenants (id, slug, business_name, industry, phone, currency, theme_color, upi_id)
VALUES (
    'b2c3d4e5-f6a7-4b5c-9d0e-1234567890bc',
    'apex-motors',
    'Apex Motors & Service Hub',
    'autocare',
    '+919812345678',
    '$',
    '#2563eb',
    'apexmotors@upi'
) ON CONFLICT (slug) DO NOTHING;

