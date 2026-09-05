'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Strength } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { ShieldCheck, Plus, Trash2, Edit3, Check, AlertCircle, X } from 'lucide-react';

const STRENGTH_ICONS = [
  'ShieldCheck',
  'Award',
  'Clock',
  'Layers',
  'Sparkles',
  'HardHat',
  'CheckCircle2',
  'Anchor',
  'Compass',
];

export default function AdminStrengthsPage() {
  const supabase = createClient();
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentStrength, setCurrentStrength] = useState<Partial<Strength>>({
    title: '',
    description: '',
    icon_name: 'ShieldCheck',
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
    } catch (err) {
      console.error('Error fetching strengths:', err);
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
      icon_name: 'ShieldCheck',
      display_order: strengths.length,
    });
    setIsEditing(true);
  };

  const handleStartEdit = (s: Strength) => {
    setCurrentStrength(s);
    setIsEditing(true);
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

      setFeedback({ type: 'success', message: 'Strength pillar saved.' });
      setIsEditing(false);
      loadStrengths();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error saving pillar.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this strength pillar?')) return;

    try {
      const { error } = await supabase.from('strengths').delete().eq('id', id);
      if (error) throw error;
      setStrengths(strengths.filter((s) => s.id !== id));
      setFeedback({ type: 'success', message: 'Pillar deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete.',
      });
    }
  };

  if (loading) return <LoadingSpinner text="Loading Strengths..." />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Core Value Pillars
          </span>
          <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
            Why Choose Us / Strengths
          </h1>
        </div>

        {!isEditing && (
          <Button
            variant="olive"
            size="sm"
            onClick={handleStartCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Pillar
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

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-xl text-near-black">
              {currentStrength.id ? 'Edit Strength Pillar' : 'New Strength Pillar'}
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
                Pillar Title *
              </label>
              <input
                type="text"
                required
                value={currentStrength.title || ''}
                onChange={(e) => setCurrentStrength({ ...currentStrength, title: e.target.value })}
                placeholder="e.g. Uncompromising Structural Safety"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Icon
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={currentStrength.icon_name || 'ShieldCheck'}
                  onChange={(e) => setCurrentStrength({ ...currentStrength, icon_name: e.target.value })}
                  className="flex-1 bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                >
                  {STRENGTH_ICONS.map((ic) => (
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
              Pillar Description *
            </label>
            <textarea
              rows={3}
              required
              value={currentStrength.description || ''}
              onChange={(e) => setCurrentStrength({ ...currentStrength, description: e.target.value })}
              placeholder="Detail safety certifications, master craftsmen experience, or zero-loss track records..."
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
              Save Pillar
            </Button>
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {strengths.length === 0 ? (
          <EmptyState
            title="No Strengths Configured"
            description="Add company differentiators and structural quality standards to display in the Why Choose Us dark editorial section."
            icon={ShieldCheck}
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3 px-6">Icon</th>
                <th className="py-3 px-6">Pillar Title</th>
                <th className="py-3 px-6">Description</th>
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
                  <td className="py-4 px-6 font-medium text-near-black text-sm">
                    {s.title}
                  </td>
                  <td className="py-4 px-6 text-warm-grey max-w-sm truncate">
                    {s.description}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(s)}
                      className="p-1.5 text-warm-grey hover:text-near-black"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
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
