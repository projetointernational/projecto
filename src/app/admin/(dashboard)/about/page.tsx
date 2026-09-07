'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AboutContent } from '@/lib/supabase/types';
import { Check, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function AdminAboutPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [about, setAbout] = useState<Partial<AboutContent>>({
    title: 'Crafting spaces of enduring permanence and uncompromising detail.',
    subtitle: 'Our Legacy & Ethos',
    narrative: 'Founded on the principles of architectural integrity and technical masterwork, Projecto bridges visionary design and master-builder execution.',
    mission_text: 'To execute every architectural blueprint with absolute structural precision, uncompromised material honesty, and responsible stewardship of the built environment.',
    vision_text: 'To remain the preeminent construction partner for complex, design-forward architectural projects globally.',
    main_image_url: '',
    secondary_image_url: '',
    stats: [
      { label: 'Years in Practice', value: '24+' },
      { label: 'Completed Projects', value: '180+' },
      { label: 'Design & Safety Awards', value: '32' },
      { label: 'Client Retention', value: '98%' },
    ],
  });

  useEffect(() => {
    async function loadAbout() {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setAbout(data);
        }
      } catch (err) {
        console.error('Error fetching about:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAbout();
  }, [supabase]);

  const handleAddStat = () => {
    const currentStats = about.stats || [];
    setAbout({
      ...about,
      stats: [...currentStats, { label: 'Metric Label', value: '100+' }],
    });
  };

  const handleUpdateStat = (idx: number, field: 'label' | 'value', val: string) => {
    const currentStats = [...(about.stats || [])];
    currentStats[idx] = { ...currentStats[idx], [field]: val };
    setAbout({ ...about, stats: currentStats });
  };

  const handleRemoveStat = (idx: number) => {
    const currentStats = (about.stats || []).filter((_, i) => i !== idx);
    setAbout({ ...about, stats: currentStats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (about.id) {
        const { error } = await supabase
          .from('about_content')
          .update({
            ...about,
            updated_at: new Date().toISOString(),
          })
          .eq('id', about.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('about_content')
          .insert([about])
          .select()
          .single();

        if (error) throw error;
        if (data) setAbout(data);
      }

      setFeedback({ type: 'success', message: 'About narrative successfully updated.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update about content.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading About Details..." />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Editorial Story
        </span>
        <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
          About And Ethos Management
        </h1>
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

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-sand/60">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Section Subtitle / Eyebrow
              </label>
              <input
                type="text"
                value={about.subtitle || ''}
                onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Core Ethos Title
              </label>
              <input
                type="text"
                required
                value={about.title || ''}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Architectural Narrative & History
            </label>
            <textarea
              rows={5}
              value={about.narrative || ''}
              onChange={(e) => setAbout({ ...about, narrative: e.target.value })}
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={about.mission_text || ''}
                onChange={(e) => setAbout({ ...about, mission_text: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={about.vision_text || ''}
                onChange={(e) => setAbout({ ...about, vision_text: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand">
            <div>
              <CloudinaryUploader
                label="Primary About Visual"
                currentImageUrl={about.main_image_url}
                onUploadSuccess={(url) => setAbout({ ...about, main_image_url: url })}
                aspectRatio="video"
                folder="about"
              />
            </div>
            <div>
              <CloudinaryUploader
                label="Secondary Craftsmanship Visual"
                currentImageUrl={about.secondary_image_url}
                onUploadSuccess={(url) => setAbout({ ...about, secondary_image_url: url })}
                aspectRatio="video"
                folder="about"
              />
            </div>
          </div>

          {/* Stats Matrix Editor */}
          <div className="pt-6 border-t border-sand space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium">
                  Milestone Statistics Matrix
                </label>
                <p className="text-[11px] text-warm-grey font-light">
                  Displayed on the home introduction and about page.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddStat}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Metric
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(about.stats || []).map((stat, idx) => (
                <div key={idx} className="p-4 bg-sand/20 rounded-sm flex items-center space-x-3">
                  <div className="w-24">
                    <input
                      type="text"
                      placeholder="Value"
                      value={stat.value}
                      onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                      className="w-full bg-white text-sm font-serif px-2.5 py-1.5 rounded-sm ring-1 ring-sand focus:ring-olive outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                      className="w-full bg-white text-xs px-2.5 py-1.5 rounded-sm ring-1 ring-sand focus:ring-olive outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="text-warm-grey hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-sand flex justify-end">
          <Button type="submit" variant="olive" size="md" isLoading={saving}>
            Save About Content
          </Button>
        </div>
      </form>
    </div>
  );
}
