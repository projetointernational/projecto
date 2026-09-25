'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EditorialFeature } from '@/lib/supabase/types';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { Check, AlertCircle, Plus, Trash2, Eye, Monitor, Smartphone } from 'lucide-react';

export default function AdminEditorialFeaturePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [feature, setFeature] = useState<Partial<EditorialFeature>>({
    subtitle: '',
    title: '',
    description: '',
    highlights: [],
    is_active: true,
  });

  const [desktopImageUrl, setDesktopImageUrl] = useState<string>('');
  const [mobileImageUrl, setMobileImageUrl] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [newHighlight, setNewHighlight] = useState('');

  useEffect(() => {
    async function loadFeature() {
      try {
        const { data, error } = await supabase
          .from('editorial_feature')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        let deskImg = '';
        let mobImg = '';
        try {
          const { data: sData } = await supabase
            .from('site_settings')
            .select('navigation_labels')
            .limit(1)
            .maybeSingle();
          const sectionImgs = sData?.navigation_labels?.section_images || {};
          deskImg = sectionImgs.coordination_desktop_image || '';
          mobImg = sectionImgs.coordination_mobile_image || '';
        } catch (sErr) {
          console.warn('Could not fetch site_settings coordination images:', sErr);
        }

        if (data) {
          setFeature({
            ...data,
            highlights: Array.isArray(data.highlights) ? data.highlights : [],
          });
          setDesktopImageUrl(data.image_url || deskImg || '');
          setMobileImageUrl(mobImg || '');
        }
      } catch (err) {
        console.error('Error fetching editorial feature:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFeature();
  }, [supabase]);

  const MAX_HIGHLIGHTS = 12;

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    const currentHighlights = feature.highlights || [];
    if (currentHighlights.length >= MAX_HIGHLIGHTS) return;
    setFeature({
      ...feature,
      highlights: [...currentHighlights, newHighlight.trim()],
    });
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index: number) => {
    const currentHighlights = (feature.highlights || []).filter((_, i) => i !== index);
    setFeature({
      ...feature,
      highlights: currentHighlights,
    });
  };

  const handleUpdateHighlight = (index: number, value: string) => {
    const currentHighlights = [...(feature.highlights || [])];
    currentHighlights[index] = value;
    setFeature({
      ...feature,
      highlights: currentHighlights,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        subtitle: feature.subtitle || null,
        title: feature.title || '',
        description: feature.description || null,
        image_url: desktopImageUrl || null,
        highlights: feature.highlights || [],
        is_active: feature.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      if (feature.id) {
        const { error } = await supabase
          .from('editorial_feature')
          .update(payload)
          .eq('id', feature.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('editorial_feature')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) setFeature(data);
      }

      // Sync background images to site_settings for global access
      try {
        const { data: sData } = await supabase.from('site_settings').select('id, navigation_labels').single();
        if (sData) {
          const nav = sData.navigation_labels || {};
          nav.section_images = {
            ...(nav.section_images || {}),
            coordination_desktop_image: desktopImageUrl || '',
            coordination_mobile_image: mobileImageUrl || '',
          };
          await supabase.from('site_settings').update({ navigation_labels: nav }).eq('id', sData.id);
        }
      } catch (syncErr) {
        console.warn('Sync warning:', syncErr);
      }

      setFeedback({ type: 'success', message: 'Coordination showcase content and background imagery saved successfully.' });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setFeedback({
        type: 'error',
        message: errorObj?.message || 'Failed to save editorial feature.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Showcase Feature..." />;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey font-medium">
          Homepage Showcase
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          Coordination Showcase Editor
        </h1>
        <p className="text-sm text-warm-grey mt-1">
          Configure the text content for the coordination showcase section on the homepage.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center space-x-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section Visibility */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black">
                Section Visibility
              </h2>
              <p className="text-xs text-warm-grey mt-0.5">
                Enable or disable this showcase section on the public landing page.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={feature.is_active ?? true}
                onChange={(e) => setFeature({ ...feature, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-sand peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-olive" />
              <span className="ml-3 text-xs font-medium text-near-black">
                {feature.is_active ? 'Active (Visible)' : 'Disabled (Hidden)'}
              </span>
            </label>
          </div>
        </div>

        {/* Editorial Content */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black border-b border-sand pb-4">
            Editorial Content
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Subtitle / Category Eyebrow
            </label>
            <input
              type="text"
              value={feature.subtitle || ''}
              onChange={(e) => setFeature({ ...feature, subtitle: e.target.value })}
              placeholder="e.g. PROJECT COORDINATION"
              className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Headline / Section Title *
            </label>
            <input
              type="text"
              required
              value={feature.title || ''}
              onChange={(e) => setFeature({ ...feature, title: e.target.value })}
              placeholder="e.g. The Right People. The Right Resources. One Coordinated Process."
              className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Narrative Description
            </label>
            <textarea
              rows={4}
              value={feature.description || ''}
              onChange={(e) => setFeature({ ...feature, description: e.target.value })}
              placeholder="e.g. Projeto can coordinate the professionals, contractors, vendors and execution teams required to progress a project..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>
        </div>

        {/* Key Highlights */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black">
                Section Highlights &amp; Disciplines ({feature.highlights?.length || 0} / {MAX_HIGHLIGHTS})
              </h2>
              <p className="text-xs text-warm-grey mt-0.5">
                Key disciplines displayed in the Coordination Ecosystem box. Max {MAX_HIGHLIGHTS} disciplines.
              </p>
            </div>
            {((feature.highlights?.length || 0) >= MAX_HIGHLIGHTS) && (
              <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                Limit reached ({MAX_HIGHLIGHTS}/{MAX_HIGHLIGHTS})
              </span>
            )}
          </div>

          {/* List of current highlights */}
          {feature.highlights && feature.highlights.length > 0 ? (
            <div className="space-y-3">
              {feature.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-olive/10 text-olive text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                    className="flex-1 bg-sand/20 focus:bg-white text-sm px-4 py-2 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-2 text-warm-grey hover:text-red-600 rounded-sm transition-colors"
                    title="Remove Highlight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-warm-grey italic">No highlights added yet.</p>
          )}

          {/* Add new highlight */}
          <div className="flex items-center space-x-2 pt-2 border-t border-sand/40">
            <input
              type="text"
              value={newHighlight}
              disabled={(feature.highlights?.length || 0) >= MAX_HIGHLIGHTS}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddHighlight();
                }
              }}
              placeholder={(feature.highlights?.length || 0) >= MAX_HIGHLIGHTS ? `Maximum ${MAX_HIGHLIGHTS} highlights reached` : "Type a new highlight and click Add..."}
              className="flex-1 bg-sand/20 focus:bg-white text-sm px-4 py-2 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={(feature.highlights?.length || 0) >= MAX_HIGHLIGHTS}
              onClick={handleAddHighlight}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Background Images Management */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="border-b border-sand pb-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-1">
              CENTRAL COORDINATION CORE
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black">
              Background Images
            </h2>
            <p className="text-xs text-warm-grey mt-0.5">
              Upload independent background images for the Central Coordination Core box. Images are rendered with a subtle translucent overlay to preserve readability. If empty, the section renders cleanly without a background image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Background Image */}
            <div className="p-5 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-near-black font-semibold">
                    Desktop Background Image
                  </h3>
                  <span className="text-[11px] text-warm-grey font-mono">
                    Recommended: 16:9 Landscape
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sand/60 text-near-black/70 rounded-xs">
                  Desktop / Tablet
                </span>
              </div>

              <CloudinaryUploader
                label=""
                currentImageUrl={desktopImageUrl}
                onUploadSuccess={(url) => setDesktopImageUrl(url)}
                aspectRatio="video"
                compact={false}
                folder="coordination"
              />

              <div className="text-[11px] text-warm-grey leading-relaxed">
                Used as the background for the Central Coordination Core box on desktop and tablet screens.
              </div>
            </div>

            {/* Mobile Background Image */}
            <div className="p-5 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-near-black font-semibold">
                    Mobile Background Image
                  </h3>
                  <span className="text-[11px] text-warm-grey font-mono">
                    Recommended: 9:16 Portrait
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sand/60 text-near-black/70 rounded-xs">
                  Mobile Viewport
                </span>
              </div>

              <CloudinaryUploader
                label=""
                currentImageUrl={mobileImageUrl}
                onUploadSuccess={(url) => setMobileImageUrl(url)}
                aspectRatio="tall"
                compact={false}
                folder="coordination"
              />

              <div className="text-[11px] text-warm-grey leading-relaxed">
                Used specifically for mobile viewports. Completely independent — desktop image is not reused if mobile image is empty.
              </div>
            </div>
          </div>
        </div>

        {/* Visual Live Preview */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-olive" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black">
                  Visual Live Preview
                </h2>
              </div>
              <p className="text-xs text-warm-grey mt-0.5">
                Simulated appearance of the Central Coordination Core with active background imagery and translucent overlay.
              </p>
            </div>

            {/* Device Toggle */}
            <div className="inline-flex rounded-sm border border-sand bg-sand/20 p-0.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-near-black text-warm-beige shadow-xs'
                    : 'text-warm-grey hover:text-near-black'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (16:9)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded-xs transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-near-black text-warm-beige shadow-xs'
                    : 'text-warm-grey hover:text-near-black'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (9:16)</span>
              </button>
            </div>
          </div>

          {/* Preview Box Container */}
          <div className="flex justify-center p-4 sm:p-6 bg-sand/15 rounded-sm border border-sand/50">
            <div
              className={`relative rounded-sm bg-off-white/50 border border-sand/80 shadow-2xs overflow-hidden transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-full max-w-2xl p-6 sm:p-8' : 'w-full max-w-sm p-4 sm:p-5'
              }`}
            >
              {/* Background Image layer */}
              {previewDevice === 'desktop' && desktopImageUrl ? (
                <div className="absolute inset-0 pointer-events-none z-0">
                  <Image
                    src={desktopImageUrl}
                    alt="Desktop Background Preview"
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px]" />
                </div>
              ) : previewDevice === 'mobile' && mobileImageUrl ? (
                <div className="absolute inset-0 pointer-events-none z-0">
                  <Image
                    src={mobileImageUrl}
                    alt="Mobile Background Preview"
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px]" />
                </div>
              ) : null}

              {/* Concentric rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
                <div className="w-[300px] h-[300px] rounded-full border border-sand-dark/50" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-sand-dark/40" />
                <div className="absolute w-[100px] h-[100px] rounded-full border border-sand-dark/30" />
              </div>

              {/* Central PROJETO Hub */}
              <div className="relative z-10 flex flex-col items-center justify-center mb-6">
                <div className="inline-flex items-center space-x-2 px-5 py-2 bg-[#171717] rounded-full text-warm-beige shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
                  <span className="font-mono text-xs font-semibold tracking-[0.25em] text-warm-beige">
                    PROJETO
                  </span>
                </div>
                <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-near-black/80 font-medium mt-2">
                  CENTRAL COORDINATION CORE
                </p>
              </div>

              {/* Disciplines */}
              <div
                className={`relative z-10 grid gap-2.5 ${
                  previewDevice === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {(feature.highlights && feature.highlights.length > 0
                  ? feature.highlights
                  : [
                      'ARCHITECTS',
                      'STRUCTURAL / CIVIL ENGINEERS',
                      'INTERIOR DESIGNERS',
                      'MEP CONSULTANTS',
                      'VAASTHU CONSULTANTS WHERE REQUIRED',
                      'MAIN & SPECIALIST CONTRACTORS',
                      'MATERIAL SUPPLIERS & VENDORS',
                      'CIVIL CONSTRUCTION TEAMS',
                      'INTERIOR & FINISHING TEAMS',
                      'ELECTRICAL & PLUMBING TEAMS',
                      'LANDSCAPING TEAMS',
                      'SPECIALIST PROJECT RESOURCES',
                    ]
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-sm border bg-white/90 backdrop-blur-xs text-near-black border-sand/80 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-olive" />
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider leading-snug break-words">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom metadata */}
              <div className="relative z-10 pt-4 mt-5 border-t border-sand/70 flex items-center justify-between text-[10px] text-near-black/75 font-mono">
                <span>{feature.highlights && feature.highlights.length > 0 ? `${feature.highlights.length} Project Disciplines` : '12 Project Disciplines'}</span>
                <span>Single Coordinated Point of Contact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-sand">
          <Button type="submit" variant="olive" isLoading={saving}>
            Save Showcase Feature
          </Button>
        </div>
      </form>
    </div>
  );
}
