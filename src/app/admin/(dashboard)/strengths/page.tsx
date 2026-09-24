'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Strength } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { Plus, Trash2, Edit3, Check, AlertCircle, X, Users } from 'lucide-react';

const AUDIENCE_ICONS = [
  'Building2',
  'Compass',
  'HardHat',
  'Layers',
  'Users',
  'ShieldCheck',
  'Package',
  'Handshake',
  'Award',
  'Sparkles',
];

export default function AdminStrengthsPage() {
  const supabase = createClient();
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [roleImageUrl, setRoleImageUrl] = useState<string>('');

  const [currentStrength, setCurrentStrength] = useState<Partial<Strength>>({
    title: '',
    description: '',
    icon_name: 'Building2',
    display_order: 0,
  });

  const loadStrengths = async () => {
    try {
      const { data, error } = await supabase
        .from('strengths')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStrengths(data || []);

      // Load section supporting image
      const { data: sData } = await supabase
        .from('site_settings')
        .select('navigation_labels')
        .single();

      if (sData?.navigation_labels?.section_images?.role_section_image) {
        setRoleImageUrl(sData.navigation_labels.section_images.role_section_image);
      }
    } catch (err) {
      console.error('Error fetching audience cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStrengths();
  }, [supabase]);

  const handleStartCreate = () => {
    setCurrentStrength({
      title: '',
      description: '',
      icon_name: 'Building2',
      display_order: strengths.length,
    });
    setIsEditing(true);
  };

  const handleStartEdit = (s: Strength) => {
    setCurrentStrength(s);
    setIsEditing(true);
  };

  const handleSaveSectionImage = async (newUrl?: string) => {
    const urlToSave = newUrl !== undefined ? newUrl : roleImageUrl;
    setSavingImage(true);
    setFeedback(null);

    try {
      const { data: sData } = await supabase
        .from('site_settings')
        .select('id, navigation_labels')
        .single();

      if (sData) {
        const nav = sData.navigation_labels || {};
        nav.section_images = {
          ...(nav.section_images || {}),
          role_section_image: urlToSave,
        };
        const { error } = await supabase
          .from('site_settings')
          .update({ navigation_labels: nav })
          .eq('id', sData.id);

        if (error) throw error;
        setRoleImageUrl(urlToSave);
        setFeedback({ type: 'success', message: 'Section supporting image successfully saved.' });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save section image.',
      });
    } finally {
      setSavingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStrength.title || !currentStrength.description) return;

    setSaving(true);
    setFeedback(null);

    const payload = {
      ...currentStrength,
      updated_at: new Date().toISOString(),
    };

    try {
      if (currentStrength.id) {
        const { error } = await supabase
          .from('strengths')
          .update(payload)
          .eq('id', currentStrength.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('strengths').insert([payload]);
        if (error) throw error;
      }

      setFeedback({ type: 'success', message: 'Audience card successfully saved.' });
      setIsEditing(false);
      loadStrengths();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error saving card.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this audience card?')) return;

    try {
      const { error } = await supabase.from('strengths').delete().eq('id', id);
      if (error) throw error;
      setStrengths(strengths.filter((s) => s.id !== id));
      setFeedback({ type: 'success', message: 'Audience card removed.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete.',
      });
    }
  };

  if (loading) return <LoadingSpinner text="Loading Audience Cards..." />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Homepage Presentation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
            Who We Work With / Audience Cards
          </h1>
          <p className="text-xs text-warm-grey font-light mt-1">
            Manage the audience cards and supporting section image on the homepage (Project Owners, Architects & Designers, Builders & Contractors, Developers).
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="olive"
            size="sm"
            onClick={handleStartCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Audience Card
          </Button>
        )}
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

      {/* Dedicated Section Supporting Image Control */}
      <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand pb-4">
          <div>
            <h2 className="font-serif text-base sm:text-lg text-near-black">
              Section Supporting Visual
            </h2>
            <p className="text-[11px] text-warm-grey font-light">
              This high-resolution image appears on the right side of the 4 cards in &quot;Built Around Your Role in the Project.&quot;
            </p>
          </div>
          <Button
            type="button"
            variant="olive"
            size="sm"
            onClick={() => handleSaveSectionImage()}
            isLoading={savingImage}
          >
            Save Section Image
          </Button>
        </div>

        <CloudinaryUploader
          label='"Built Around Your Role in the Project." Right-Side Supporting Visual'
          currentImageUrl={roleImageUrl}
          onUploadSuccess={(url) => {
            setRoleImageUrl(url);
            handleSaveSectionImage(url);
          }}
          aspectRatio="video"
          folder="audiences"
        />
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-xl text-near-black">
              {currentStrength.id ? 'Edit Audience Card' : 'New Audience Card'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-warm-grey hover:text-near-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Card Title (Audience Group) *
              </label>
              <input
                type="text"
                required
                value={currentStrength.title || ''}
                onChange={(e) => setCurrentStrength({ ...currentStrength, title: e.target.value })}
                placeholder="e.g. ARCHITECTS & DESIGNERS"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Icon
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={currentStrength.icon_name || 'Building2'}
                  onChange={(e) => setCurrentStrength({ ...currentStrength, icon_name: e.target.value })}
                  className="flex-1 bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                >
                  {AUDIENCE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
                <div className="w-10 h-10 rounded-sm bg-sand/40 flex items-center justify-center text-olive shrink-0">
                  <IconResolver name={currentStrength.icon_name} className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Value Proposition / Description *
            </label>
            <textarea
              rows={3}
              required
              value={currentStrength.description || ''}
              onChange={(e) => setCurrentStrength({ ...currentStrength, description: e.target.value })}
              placeholder="e.g. We Coordinate. You Design."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div className="pt-4 border-t border-sand flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="olive" size="sm" isLoading={saving}>
              Save Card
            </Button>
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {strengths.length === 0 ? (
          <EmptyState
            title="No Audience Cards Configured"
            description="Add target stakeholder cards (Project Owners, Architects, Builders, Developers)."
            icon={Users}
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3 px-6">Icon</th>
                <th className="py-3 px-6">Audience Group</th>
                <th className="py-3 px-6">Value Proposition</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {strengths.map((s) => (
                <tr key={s.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-8 h-8 rounded-sm bg-sand/40 text-olive flex items-center justify-center">
                      <IconResolver name={s.icon_name} className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-near-black text-sm uppercase">
                    {s.title}
                  </td>
                  <td className="py-4 px-6 text-near-black/80 max-w-sm">
                    {s.description}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(s)}
                      aria-label="Edit audience card"
                      className="p-1.5 text-warm-grey hover:text-near-black"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      aria-label="Delete audience card"
                      className="p-1.5 text-warm-grey hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
