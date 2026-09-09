-- ==============================================================================
-- PROJECTO - EDITORIAL FEATURE / SHOWCASE IMAGE SECTION SCHEMA
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- NOTE: No mock data is seeded per project specifications.
-- ==============================================================================

-- Create editorial_feature table if it does not exist
CREATE TABLE IF NOT EXISTS editorial_feature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subtitle TEXT DEFAULT 'CRAFTSMANSHIP & RIGOR',
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  image_position TEXT DEFAULT 'left',
  highlights JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If the table already exists, run this query in Supabase SQL Editor to remove the columns:
-- ALTER TABLE editorial_feature DROP COLUMN IF EXISTS cta_text;
-- ALTER TABLE editorial_feature DROP COLUMN IF EXISTS cta_link;

-- Enable Row Level Security (RLS)
ALTER TABLE editorial_feature ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
CREATE POLICY "Public Read Editorial Feature" 
  ON editorial_feature 
  FOR SELECT 
  USING (true);

-- Authenticated Admin Policy (Full CRUD)
CREATE POLICY "Admin All Editorial Feature" 
  ON editorial_feature 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Schema & Table Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE editorial_feature TO anon, authenticated, service_role;
