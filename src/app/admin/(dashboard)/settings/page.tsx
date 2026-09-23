'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SiteSettings } from '@/lib/supabase/types';
import { Check, AlertCircle, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'navigation' | 'form' | 'social'>('profile');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    company_name: 'Projeto International',
    tagline: 'One Project. One Coordinated Partner.',
    logo_url: '',
    company_description: 'Projeto International supports construction, interior and related projects through procurement and project coordination.',
    email: 'projetointernational@gmail.com',
    phone: '+91 9072873225',
    address: 'Kochi, Kerala',
    working_hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
    enquiry_notification_email: 'projetointernational@gmail.com',
    social_links: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      whatsapp: 'https://wa.me/919072873225',
      phone: 'tel:+919072873225',
    },
    navigation_labels: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      contact: 'Contact',
      enquire: 'Discuss Your Project',
      menu: [
        { label: 'Home', href: '/', active: true, order: 0 },
        { label: 'About', href: '/about', active: true, order: 1 },
        {
          label: 'Services',
          href: '/services',
          active: true,
          order: 2,
          dropdown: [
            { label: 'Procurement', href: '/services/procurement', active: true, order: 0 },
            { label: 'Project Coordination', href: '/services/project-coordination', active: true, order: 1 },
            { label: 'Materials / Project Supplies', href: '/services/materials-project-supplies', active: true, order: 2 },
            { label: 'For Architects & Designers', href: '/services/for-architects-designers', active: true, order: 3 },
            { label: 'For Builders & Contractors', href: '/services/for-builders-contractors', active: true, order: 4 },
            { label: 'How We Work', href: '/services/how-we-work', active: true, order: 5 },
          ],
        },
        { label: 'Projects', href: '/projects', active: true, order: 3 },
        { label: 'Contact', href: '/contact', active: true, order: 4 },
      ],
      form_options: {
        project_types: ['Residential', 'Commercial', 'Interior', 'Renovation', 'New Construction', 'Other'],
        required_support: [
          'Procurement',
          'Procurement Consultancy',
          'Project Coordination',
          'Complete Project Support',
          'Material Supply',
          'Contractor Coordination',
          'Professional Coordination',
          'Other',
        ],
        project_stages: ['Planning', 'Design', 'BOQ Ready', 'Procurement', 'Construction', 'Interior', 'Other'],
        contact_methods: ['Phone', 'WhatsApp', 'Email'],
      },
      whatsapp_number: '+919072873225',
      phone_number: '+919072873225',
    },
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
            navigation_labels: {
              ...prev.navigation_labels,
              ...data.navigation_labels,
            },
          }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [supabase]);

  // Dropdown items helper (targeting Services dropdown)
  const currentMenu = settings.navigation_labels?.menu || [];
  const servicesItem = currentMenu.find((m) => m.label.toLowerCase() === 'services');
  const dropdownItems = servicesItem?.dropdown || [];

  const handleUpdateDropdownItem = (
    idx: number,
    field: 'label' | 'href' | 'active',
    value: any
  ) => {
    const updatedDropdown = [...dropdownItems];
    updatedDropdown[idx] = {
      ...updatedDropdown[idx],
      [field]: value,
    };

    const updatedMenu = currentMenu.map((m) =>
      m.label.toLowerCase() === 'services' ? { ...m, dropdown: updatedDropdown } : m
    );

    setSettings({
      ...settings,
      navigation_labels: {
        ...settings.navigation_labels,
        menu: updatedMenu,
      },
    });
  };

  const handleAddDropdownItem = () => {
    const newSubItem = {
      label: 'New Capability',
      href: '/services/new-service',
      active: true,
      order: dropdownItems.length,
    };
    const updatedDropdown = [...dropdownItems, newSubItem];
    const updatedMenu = currentMenu.map((m) =>
      m.label.toLowerCase() === 'services' ? { ...m, dropdown: updatedDropdown } : m
    );
    setSettings({
      ...settings,
      navigation_labels: {
        ...settings.navigation_labels,
        menu: updatedMenu,
      },
    });
  };

  const handleRemoveDropdownItem = (idx: number) => {
    const updatedDropdown = dropdownItems.filter((_, i) => i !== idx);
    const updatedMenu = currentMenu.map((m) =>
      m.label.toLowerCase() === 'services' ? { ...m, dropdown: updatedDropdown } : m
    );
    setSettings({
      ...settings,
      navigation_labels: {
        ...settings.navigation_labels,
        menu: updatedMenu,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (settings.id) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('site_settings')
          .insert([settings])
          .select()
          .single();

        if (error) throw error;
        if (data) setSettings(data);
      }

      setFeedback({ type: 'success', message: 'Site settings and navigation updated successfully.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Settings..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Platform Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          Site Settings & Navigation Management
        </h1>
        <p className="text-xs text-warm-grey font-light mt-1">
          Manage brand profile, navbar & services dropdown items, form options, and contact channels without code modification.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sand pb-1 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
            activeTab === 'profile' ? 'bg-olive text-white' : 'bg-white text-near-black border border-sand/70'
          }`}
        >
          Company Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('navigation')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
            activeTab === 'navigation' ? 'bg-olive text-white' : 'bg-white text-near-black border border-sand/70'
          }`}
        >
          Navigation & Services Dropdown
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
            activeTab === 'form' ? 'bg-olive text-white' : 'bg-white text-near-black border border-sand/70'
          }`}
        >
          Enquiry Form & Channels
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
            activeTab === 'social' ? 'bg-olive text-white' : 'bg-white text-near-black border border-sand/70'
          }`}
        >
          Social Channels
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center space-x-2 ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-sm shadow-sm border border-sand/60">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg text-near-black border-b border-sand pb-3">
              Brand Positioning & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.company_name || ''}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Tagline / Positioning Motto *
                </label>
                <input
                  type="text"
                  value={settings.tagline || ''}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="e.g. One Project. One Coordinated Partner."
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Company Description (Used across Footer & SEO)
              </label>
              <textarea
                rows={3}
                value={settings.company_description || ''}
                onChange={(e) => setSettings({ ...settings, company_description: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <CloudinaryUploader
                label="Primary Brand Logo (Cloudinary)"
                currentImageUrl={settings.logo_url}
                onUploadSuccess={(url) => setSettings({ ...settings, logo_url: url })}
                aspectRatio="wide"
                folder="branding"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Public Inquiries Email
                </label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Public Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Office Location / City
                </label>
                <input
                  type="text"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={settings.working_hours || ''}
                  onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Navigation & Services Dropdown */}
        {activeTab === 'navigation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <div>
                <h2 className="font-serif text-lg text-near-black">
                  Services Dropdown Menu Items
                </h2>
                <p className="text-xs text-warm-grey font-light">
                  Add, rename, re-link, or toggle active any item in the public Services dropdown.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDropdownItem}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {dropdownItems.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-sand/15 rounded-sm border border-sand/60 flex flex-col sm:flex-row items-center gap-4"
                >
                  <span className="text-[10px] font-mono text-warm-beige bg-near-black px-2 py-0.5 rounded-sm shrink-0">
                    0{idx + 1}
                  </span>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={sub.label}
                      onChange={(e) => handleUpdateDropdownItem(idx, 'label', e.target.value)}
                      placeholder="Menu Label"
                      className="bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none font-medium"
                    />
                    <input
                      type="text"
                      value={sub.href}
                      onChange={(e) => handleUpdateDropdownItem(idx, 'href', e.target.value)}
                      placeholder="/services/..."
                      className="bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none font-mono text-warm-grey"
                    />
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <label className="flex items-center space-x-1.5 text-xs text-near-black cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sub.active !== false}
                        onChange={(e) => handleUpdateDropdownItem(idx, 'active', e.target.checked)}
                        className="rounded text-olive focus:ring-olive"
                      />
                      <span>Active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveDropdownItem(idx)}
                      className="p-1.5 text-warm-grey hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navbar CTA Button Label */}
            <div className="pt-6 border-t border-sand">
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Navbar Primary Button Label
              </label>
              <input
                type="text"
                value={settings.navigation_labels?.enquire || 'Discuss Your Project'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    navigation_labels: {
                      ...settings.navigation_labels,
                      enquire: e.target.value,
                    },
                  })
                }
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none max-w-sm"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Form Options & Direct Channels */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg text-near-black border-b border-sand pb-3">
              Direct Communication & Form Dropdown Configurations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  WhatsApp Direct Number (e.g. +91 9072873225)
                </label>
                <input
                  type="text"
                  value={settings.navigation_labels?.whatsapp_number || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      navigation_labels: {
                        ...settings.navigation_labels,
                        whatsapp_number: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Direct Call Number
                </label>
                <input
                  type="text"
                  value={settings.navigation_labels?.phone_number || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      navigation_labels: {
                        ...settings.navigation_labels,
                        phone_number: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-sand">
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Project Types (Comma-separated)
              </label>
              <input
                type="text"
                value={(settings.navigation_labels?.form_options?.project_types || []).join(', ')}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    navigation_labels: {
                      ...settings.navigation_labels,
                      form_options: {
                        ...settings.navigation_labels?.form_options,
                        project_types: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    },
                  })
                }
                className="w-full bg-sand/20 focus:bg-white text-xs px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Required Support Options (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={(settings.navigation_labels?.form_options?.required_support || []).join(', ')}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    navigation_labels: {
                      ...settings.navigation_labels,
                      form_options: {
                        ...settings.navigation_labels?.form_options,
                        required_support: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    },
                  })
                }
                className="w-full bg-sand/20 focus:bg-white text-xs p-3 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Project Stages (Comma-separated)
              </label>
              <input
                type="text"
                value={(settings.navigation_labels?.form_options?.project_stages || []).join(', ')}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    navigation_labels: {
                      ...settings.navigation_labels,
                      form_options: {
                        ...settings.navigation_labels?.form_options,
                        project_stages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    },
                  })
                }
                className="w-full bg-sand/20 focus:bg-white text-xs px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Social Links */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg text-near-black border-b border-sand pb-3">
              Social Media Accounts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.social_links?.instagram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, instagram: e.target.value },
                    })
                  }
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={settings.social_links?.linkedin || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, linkedin: e.target.value },
                    })
                  }
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={settings.social_links?.twitter || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, twitter: e.target.value },
                    })
                  }
                  className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-sand flex justify-end">
          <Button type="submit" variant="olive" size="md" isLoading={saving}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
