'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HeroContent } from '@/lib/supabase/types';
import { Check, AlertCircle } from 'lucide-react';

export default function AdminHeroPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [hero, setHero] = useState<Partial<HeroContent>>({
    headline: 'Constructing Architectural Milestones with Vision & Precision',
    subheadline: 'Engineering & Construction',
    intro_text: 'From bespoke residential sanctuaries to landmark commercial developments, Projecto crafts enduring structures that unite architectural clarity with rigorous engineering.',
    background_image_url: '',
    cta_primary_text: 'Explore our projects',
    cta_primary_link: '/projects',
    cta_secondary_text: 'Get in touch',
    cta_secondary_link: '/contact',
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setHero(data);
        }
      } catch (err) {
        console.error('Error fetching hero:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHero();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      if (hero.id) {
        const { error } = await supabase
          .from('hero_content')
          .update({
            ...hero,
            updated_at: new Date().toISOString(),
          })
          .eq('id', hero.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('hero_content')
          .insert([hero])
          .select()
          .single();

        if (error) throw error;
        if (data) setHero(data);
      }

      setFeedback({ type: 'success', message: 'Hero content successfully saved.' });
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: string };
      const rawMessage = errorObj?.message || (err instanceof Error ? err.message : 'Failed to update hero.');
      setFeedback({
        type: 'error',
        message: rawMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Hero Content..." />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Homepage Presentation
        </span>
        <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
          Hero Section Editor
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
          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Subheadline / Architectural Category
            </label>
            <input
              type="text"
              value={hero.subheadline || ''}
              onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
              placeholder="e.g. Engineering & Construction"
              className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Main Editorial Headline
            </label>
            <textarea
              rows={2}
              required
              value={hero.headline || ''}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              placeholder="e.g. Constructing Architectural Milestones with Vision & Precision"
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Company Introduction / Lead Paragraph
            </label>
            <textarea
              rows={3}
              value={hero.intro_text || ''}
              onChange={(e) => setHero({ ...hero, intro_text: e.target.value })}
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <CloudinaryUploader
              label="Hero Architectural Milestone Background (Cloudinary)"
              currentImageUrl={hero.background_image_url}
              onUploadSuccess={(url) => setHero({ ...hero, background_image_url: url })}
              aspectRatio="wide"
              folder="hero"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Primary Call-To-Action Text
              </label>
              <input
                type="text"
                value={hero.cta_primary_text || ''}
                onChange={(e) => setHero({ ...hero, cta_primary_text: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Primary Call-To-Action Link
              </label>
              <input
                type="text"
                value={hero.cta_primary_link || ''}
                onChange={(e) => setHero({ ...hero, cta_primary_link: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Secondary Call-To-Action Text
              </label>
              <input
                type="text"
                value={hero.cta_secondary_text || ''}
                onChange={(e) => setHero({ ...hero, cta_secondary_text: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Secondary Call-To-Action Link
              </label>
              <input
                type="text"
                value={hero.cta_secondary_link || ''}
                onChange={(e) => setHero({ ...hero, cta_secondary_link: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-sand flex justify-end">
          <Button type="submit" variant="olive" size="md" isLoading={saving}>
            Save Hero Content
          </Button>
        </div>
      </form>
    </div>
  );
}
