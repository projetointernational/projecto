-- ==============================================================================
-- PROJECTO - CONSTRUCTION COMPANY DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SITE SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL DEFAULT 'Projecto',
  tagline TEXT DEFAULT 'Architectural Construction & Engineering Excellence',
  logo_url TEXT,
  company_description TEXT DEFAULT 'Specialized architectural construction, luxury residential developments, and commercial structural engineering built with uncompromising craftsmanship.',
  email TEXT DEFAULT 'contact@projecto.com',
  phone TEXT DEFAULT '+1 (555) 234-5678',
  address TEXT DEFAULT '450 Architectural Boulevard, Suite 800, New York, NY 10018',
  working_hours TEXT DEFAULT 'Monday - Friday: 8:00 AM - 6:00 PM',
  social_links JSONB DEFAULT '{"instagram": "https://instagram.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}'::jsonb,
  navigation_labels JSONB DEFAULT '{"home": "Home", "about": "About", "services": "Services", "projects": "Projects", "contact": "Contact", "enquire": "Start an Enquiry"}'::jsonb,
  enquiry_notification_email TEXT DEFAULT 'enquiries@projecto.com',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. HOME HERO CONTENT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline TEXT NOT NULL DEFAULT 'Constructing Architectural Milestones with Vision & Precision',
  subheadline TEXT DEFAULT 'Engineering & Construction',
  intro_text TEXT DEFAULT 'From bespoke residential sanctuaries to landmark commercial developments, Projecto crafts enduring structures that unite architectural clarity with rigorous engineering.',
  background_image_url TEXT,
  cta_primary_text TEXT DEFAULT 'Explore our projects',
  cta_primary_link TEXT DEFAULT '/projects',
  cta_secondary_text TEXT DEFAULT 'Get in touch',
  cta_secondary_link TEXT DEFAULT '/contact',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ABOUT CONTENT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Crafting spaces of enduring permanence and uncompromising detail.',
  subtitle TEXT DEFAULT 'Our Legacy & Ethos',
  narrative TEXT DEFAULT 'Founded on the principles of architectural integrity and technical masterwork, Projecto bridges visionary design and master-builder execution. We partner with world-renowned architects, institutional developers, and discerning private clients to realize structures that redefine landscapes.',
  mission_text TEXT DEFAULT 'To execute every architectural blueprint with absolute structural precision, uncompromised material honesty, and responsible stewardship of the built environment.',
  vision_text TEXT DEFAULT 'To remain the preeminent construction partner for complex, design-forward architectural projects globally.',
  main_image_url TEXT,
  secondary_image_url TEXT,
  stats JSONB DEFAULT '[{"label": "Years in Practice", "value": "24+"}, {"label": "Completed Projects", "value": "180+"}, {"label": "Design & Safety Awards", "value": "32"}, {"label": "Client Retention", "value": "98%"}]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PROJECT CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT,
  short_description TEXT NOT NULL,
  full_description TEXT,
  main_image_url TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  client TEXT,
  location TEXT,
  year TEXT,
  area TEXT,
  status TEXT DEFAULT 'Completed',
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. SERVICES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  icon_name TEXT DEFAULT 'Building2',
  image_url TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. WHY CHOOSE US / STRENGTHS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS strengths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'ShieldCheck',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. TESTIMONIALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  company TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  project_reference TEXT,
  rating INT DEFAULT 5,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. CONTACT PAGE CONTENT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading TEXT DEFAULT 'Let us build your next landmark together.',
  intro_text TEXT DEFAULT 'Whether initiating a ground-up development, architectural renovation, or specialized structural consultation, our senior engineering partners are ready to review your blueprints.',
  map_embed_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. ENQUIRIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. CLIENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE strengths ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public Read About Content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Strengths" ON strengths FOR SELECT USING (true);
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Contact Page" ON contact_page FOR SELECT USING (true);
CREATE POLICY "Public Read Clients" ON clients FOR SELECT USING (true);

-- Public Insert Enquiries
CREATE POLICY "Public Insert Enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full CRUD)
CREATE POLICY "Admin All Site Settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Hero Content" ON hero_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All About Content" ON about_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Strengths" ON strengths FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Contact Page" ON contact_page FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Enquiries" ON enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- SCHEMA & TABLE PERMISSIONS (Required for Supabase API Gateway & RLS)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

