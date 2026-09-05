'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SiteSettings } from '@/lib/supabase/types';
import { Check, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    company_name: 'Projecto',
    tagline: 'Architectural Construction & Engineering Excellence',
    logo_url: '',
    company_description: '',
    email: 'contact@projecto.com',
    phone: '+1 (555) 234-5678',
    address: '450 Architectural Boulevard, Suite 800, New York, NY 10018',
    working_hours: 'Monday - Friday: 8:00 AM - 6:00 PM',
    enquiry_notification_email: 'enquiries@projecto.com',
    social_links: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
    navigation_labels: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      contact: 'Contact',
      enquire: 'Start Enquiry',
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
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [supabase]);

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

      setFeedback({ type: 'success', message: 'Site settings updated successfully.' });
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
          Configuration
        </span>
        <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
          Site Settings & Identity
        </h1>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-sand/60">
        {/* Company Identity */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-near-black border-b border-sand pb-3">
            Company Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Company Name
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
                Tagline / Descriptor
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Company Narrative / Footer Summary
            </label>
            <textarea
              rows={3}
              value={settings.company_description || ''}
              onChange={(e) => setSettings({ ...settings, company_description: e.target.value })}
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none resize-y"
            />
          </div>

          <div>
            <CloudinaryUploader
              label="Company Logo / Brand Mark (Cloudinary)"
              currentImageUrl={settings.logo_url}
              onUploadSuccess={(url) => setSettings({ ...settings, logo_url: url })}
              aspectRatio="video"
              folder="branding"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-6 pt-6">
          <h2 className="font-serif text-xl text-near-black border-b border-sand pb-3">
            Headquarters & Inquiries
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Official Email
              </label>
              <input
                type="email"
                required
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Telephone
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Physical Studio Address
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
                Operating Schedule
              </label>
              <input
                type="text"
                value={settings.working_hours || ''}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Enquiry Notification Dispatch Target Email
            </label>
            <input
              type="email"
              value={settings.enquiry_notification_email || ''}
              onChange={(e) => setSettings({ ...settings, enquiry_notification_email: e.target.value })}
              className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
            <p className="text-[11px] text-warm-grey mt-1">
              Brevo will dispatch transactional notifications to this inbox upon client submission.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-sand flex justify-end">
          <Button
            type="submit"
            variant="olive"
            size="md"
            isLoading={saving}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
