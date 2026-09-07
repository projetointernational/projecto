-- ==============================================================================
-- CLIENTS TABLE CLEANUP & MIGRATION (LOGO ONLY)
-- Run this script in your Supabase SQL Editor
-- ==============================================================================

-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Remove unwanted columns if you already created the table earlier
ALTER TABLE clients 
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS website_url,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS updated_at;

-- 3. Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 4. Reset policies
DROP POLICY IF EXISTS "Public Read Clients" ON clients;
DROP POLICY IF EXISTS "Admin All Clients" ON clients;

-- Public Read Policy
CREATE POLICY "Public Read Clients" ON clients FOR SELECT USING (true);

-- Authenticated Admin Policies (Full CRUD)
CREATE POLICY "Admin All Clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Permissions
GRANT ALL ON TABLE clients TO anon, authenticated, service_role;
