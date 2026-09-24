'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EditorialFeature } from '@/lib/supabase/types';
import { Check, AlertCircle, Plus, Trash2 } from 'lucide-react';

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
        // image_url and image_position are not editable from this panel
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
