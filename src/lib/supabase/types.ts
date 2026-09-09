export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface SiteSettings {
  id: string;
  company_name: string;
  tagline?: string | null;
  logo_url?: string | null;
  company_description: string;
  email: string;
  phone: string;
  address: string;
  working_hours?: string | null;
  social_links?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  } | null;
  navigation_labels?: {
    home?: string;
    about?: string;
    services?: string;
    projects?: string;
    contact?: string;
    enquire?: string;
  } | null;
  enquiry_notification_email?: string | null;
  updated_at?: string;
}

export interface HeroContent {
  id: string;
  headline: string;
  subheadline?: string | null;
  intro_text?: string | null;
  background_image_url?: string | null;
  cta_primary_text?: string | null;
  cta_primary_link?: string | null;
  cta_secondary_text?: string | null;
  cta_secondary_link?: string | null;
  updated_at?: string;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle?: string | null;
  narrative?: string | null;
  mission_text?: string | null;
  vision_text?: string | null;
  main_image_url?: string | null;
  secondary_image_url?: string | null;
  stats?: Array<{ label: string; value: string }> | null;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id?: string | null;
  category_name?: string | null;
  short_description: string;
  full_description?: string | null;
  main_image_url: string;
  gallery_images?: string[];
  client?: string | null;
  location?: string | null;
  year?: string | null;
  area?: string | null;
  status: string;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string | null;
  icon_name?: string | null;
  image_url?: string | null;
  features?: string[];
  display_order: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Strength {
  id: string;
  title: string;
  description: string;
  icon_name?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title?: string | null;
  company?: string | null;
  quote: string;
  avatar_url?: string | null;
  project_reference?: string | null;
  rating: number;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ContactPageContent {
  id: string;
  heading?: string | null;
  intro_text?: string | null;
  map_embed_url?: string | null;
  updated_at?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service_type?: string | null;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  logo_url: string;
  created_at?: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  icon_name: string;
}

export interface ProcessContent {
  id: string;
  subtitle?: string | null;
  title: string;
  description?: string | null;
  steps?: WorkflowStep[] | null;
  is_active?: boolean;
  updated_at?: string;
}

export interface EditorialFeature {
  id: string;
  subtitle?: string | null;
  title: string;
  description?: string | null;
  image_url?: string | null;
  image_position?: 'left' | 'right';
  highlights?: string[] | null;
  is_active?: boolean;
  updated_at?: string;
}
