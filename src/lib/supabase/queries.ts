/**
 * lib/supabase/queries.ts
 *
 * Centralised, React-cache()-wrapped server-side data-fetch functions.
 *
 * KEY GOALS:
 *  - Every public Supabase table is queried through ONE cached function.
 *  - React `cache()` deduplicates identical calls within a single render pass
 *    (even if multiple Server Components call the same function).
 *  - ISR revalidation (revalidate=60 on pages) handles periodic cache refresh.
 *  - Admin save actions should call /api/admin/revalidate to bust cache immediately.
 *  - Only fields actually consumed by the public UI are selected.
 */

import { cache } from 'react';
import { createPublicServerClient } from './server';
import type {
  SiteSettings,
  HeroContent,
  AboutContent,
  ProcessContent,
  Service,
  Project,
  Strength,
  Client,
  EditorialFeature,
  ContactPageContent,
  Category,
} from './types';

// ---------------------------------------------------------------------------
// Site Settings  (navbar, footer, section images, global config)
// ---------------------------------------------------------------------------
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('site_settings')
      .select(
        'id,company_name,tagline,logo_url,email,phone,address,working_hours,social_links,navigation_labels,company_description'
      )
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Hero Content
// ---------------------------------------------------------------------------
export const getHeroContent = cache(async (): Promise<HeroContent | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// About Content
// ---------------------------------------------------------------------------
export const getAboutContent = cache(async (): Promise<AboutContent | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Process Collections  (Procurement, Coordination Support, Project Workflow)
// ---------------------------------------------------------------------------
export const getProcessCollections = cache(async (): Promise<ProcessContent[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('process_content')
      .select('*')
      .eq('is_active', true);
    return data || [];
  } catch {
    return [];
  }
});

// Single process collection (used by About page)
export const getFirstProcessCollection = cache(async (): Promise<ProcessContent | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('process_content')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export const getServices = cache(async (): Promise<Service[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('services')
      .select(
        'id,title,slug,short_description,full_description,icon_name,image_url,features,display_order,is_featured'
      )
      .order('display_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
});

// Single service by slug
export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Editorial Feature  (Coordination Showcase)
// ---------------------------------------------------------------------------
export const getEditorialFeature = cache(async (): Promise<EditorialFeature | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('editorial_feature')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('projects')
      .select(
        'id,title,slug,category_name,short_description,main_image_url,location,year,display_order,is_featured,status'
      )
      .order('display_order', { ascending: true })
      .limit(6);
    return data || [];
  } catch {
    return [];
  }
});

export const getAllProjects = cache(async (): Promise<Project[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('projects')
      .select(
        'id,title,slug,category_id,category_name,short_description,main_image_url,location,year,status,is_featured,display_order'
      )
      .order('display_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Audience / Strengths
// ---------------------------------------------------------------------------
export const getStrengths = cache(async (): Promise<Strength[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('strengths')
      .select('id,title,description,icon_name,display_order')
      .order('display_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
});

// ---------------------------------------------------------------------------
// Clients / Partners
// ---------------------------------------------------------------------------
export const getClients = cache(async (): Promise<Client[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('clients')
      .select('id,logo_url')
      .order('created_at', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
});

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('categories')
      .select('id,name,slug,display_order')
      .order('display_order', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
});

// ---------------------------------------------------------------------------
// Contact Page Content
// ---------------------------------------------------------------------------
export const getContactPageContent = cache(async (): Promise<ContactPageContent | null> => {
  try {
    const supabase = createPublicServerClient();
    const { data } = await supabase
      .from('contact_page')
      .select('*')
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
});
