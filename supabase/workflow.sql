-- ==============================================================================
-- PROJECTO - WHAT WE DO / PROCESS WORKFLOW SCHEMA
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- NOTE: No mock data is seeded per project specifications.
-- ==============================================================================

-- Create process_content table if it does not exist
CREATE TABLE IF NOT EXISTS process_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtitle TEXT DEFAULT 'WHAT WE DO',
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  steps JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE process_content ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
CREATE POLICY "Public Read Process Content" 
  ON process_content 
  FOR SELECT 
  USING (true);

-- Authenticated Admin Policy (Full CRUD)
CREATE POLICY "Admin All Process Content" 
  ON process_content 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Schema & Table Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE process_content TO anon, authenticated, service_role;
