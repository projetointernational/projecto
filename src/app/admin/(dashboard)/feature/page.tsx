'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EditorialFeature } from '@/lib/supabase/types';
import { Check, AlertCircle, Plus, Trash2, LayoutTemplate, Eye } from 'lucide-react';

export default function AdminEditorialFeaturePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [feature, setFeature] = useState<Partial<EditorialFeature>>({
    subtitle: '',
    title: '',
    description: '',
    image_url: '',
    image_position: 'left',
    highlights: [],
    is_active: true,
  });

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
        if (data) {
          setFeature({
            ...data,
            highlights: Array.isArray(data.highlights) ? data.highlights : [],
          });
        }
      } catch (err) {
        console.error('Error fetching editorial feature:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFeature();
  }, [supabase]);

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    const currentHighlights = feature.highlights || [];
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
        image_url: feature.image_url || null,
        image_position: feature.image_position || 'left',
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

      setFeedback({ type: 'success', message: 'Showcase feature saved successfully.' });
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

  const isImageRight = feature.image_position === 'right';

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey font-medium">
          Homepage Showcase
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          Showcase Feature Editor
        </h1>
        <p className="text-sm text-warm-grey mt-1">
          Configure the architectural showcase section that appears between Featured Services and Featured Projects.
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
        {/* Section Visibility & Layout Orientation Card */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand/40">
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

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-3">
              Image & Content Alignment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFeature({ ...feature, image_position: 'left' })}
                className={`p-4 rounded-sm border text-left flex items-center space-x-3 transition-all ${feature.image_position !== 'right'
                    ? 'border-olive bg-olive/5 text-near-black ring-1 ring-olive'
                    : 'border-sand hover:border-warm-grey text-warm-grey'
                  }`}
              >
                <LayoutTemplate className="w-5 h-5 text-olive shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-near-black">
                    Image Left, Content Right
                  </p>
                  <p className="text-[11px] text-warm-grey">
                    Traditional editorial layout with image on the left.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFeature({ ...feature, image_position: 'right' })}
                className={`p-4 rounded-sm border text-left flex items-center space-x-3 transition-all ${feature.image_position === 'right'
                    ? 'border-olive bg-olive/5 text-near-black ring-1 ring-olive'
                    : 'border-sand hover:border-warm-grey text-warm-grey'
                  }`}
              >
                <LayoutTemplate className="w-5 h-5 text-olive shrink-0 scale-x-[-1]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-near-black">
                    Content Left, Image Right
                  </p>
                  <p className="text-[11px] text-warm-grey">
                    Mirrored editorial layout with image on the right.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Media Uploader Card */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black mb-1">
            Featured Image
          </h2>
          <div className="max-w-md">
            <CloudinaryUploader
              label="Showcase High-Resolution Image"
              currentImageUrl={feature.image_url}
              onUploadSuccess={(url) => setFeature({ ...feature, image_url: url })}
              aspectRatio="video"
              folder="showcase"
            />
          </div>
        </div>

        {/* Narrative & Headlines Card */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black">
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
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>
        </div>

        {/* Key Highlights Card */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-near-black">
                Section Highlights & Bullet Points
              </h2>
              <p className="text-xs text-warm-grey mt-0.5">
                Add key milestones, capabilities, or architectural highlights.
              </p>
            </div>
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
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddHighlight();
                }
              }}
              placeholder="Type a new highlight and click Add..."
              className="flex-1 bg-sand/20 focus:bg-white text-sm px-4 py-2 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddHighlight}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Live Preview Section */}
        {(feature.title || feature.image_url) && (
          <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-4">
            <div className="flex items-center space-x-2 text-warm-grey">
              <Eye className="w-4 h-4 text-olive" />
              <h2 className="text-xs uppercase tracking-wider font-semibold text-near-black">
                Live Layout Preview
              </h2>
            </div>
            <div className="border border-sand/60 rounded-sm p-6 bg-sand/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {feature.image_url ? (
                  <div
                    className={`relative aspect-[4/3] w-full rounded-sm overflow-hidden bg-sand/30 border border-sand/60 ${isImageRight ? 'md:order-2' : 'md:order-1'
                      }`}
                  >
                    <Image
                      src={feature.image_url}
                      alt={feature.title || 'Preview'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`aspect-[4/3] w-full rounded-sm bg-sand/30 border border-dashed border-sand flex items-center justify-center text-xs text-warm-grey ${isImageRight ? 'md:order-2' : 'md:order-1'
                      }`}
                  >
                    No image uploaded yet
                  </div>
                )}

                <div className={isImageRight ? 'md:order-1' : 'md:order-2'}>
                  {feature.subtitle && (
                    <div className="inline-flex items-center space-x-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                      <span className="text-[10px] uppercase tracking-widest text-warm-grey font-medium">
                        {feature.subtitle}
                      </span>
                    </div>
                  )}
                  <h3 className="font-serif text-xl sm:text-2xl text-near-black mb-3">
                    {feature.title || 'Title will appear here'}
                  </h3>
                  {feature.description && (
                    <p className="text-xs text-warm-grey leading-relaxed mb-4">
                      {feature.description}
                    </p>
                  )}
                  {feature.highlights && feature.highlights.length > 0 && (
                    <ul className="space-y-1.5 mb-4 text-xs text-near-black">
                      {feature.highlights.map((h, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-olive shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="pt-1">
                    <span className="inline-block text-xs bg-olive text-white px-4 py-2 rounded-sm font-medium">
                      Contact Us
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-sand">
          <Button type="submit" variant="olive" isLoading={saving}>
            Save Showcase Feature
          </Button>
        </div>
      </form>
    </div>
  );
}
