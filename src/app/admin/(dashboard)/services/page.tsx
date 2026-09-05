'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Service } from '@/lib/supabase/types';
import { IconResolver } from '@/components/ui/IconResolver';
import { Wrench, Plus, Trash2, Edit3, Check, AlertCircle, X } from 'lucide-react';

const AVAILABLE_ICONS = [
  'Building2',
  'DraftingCompass',
  'Hammer',
  'Ruler',
  'HardHat',
  'ShieldCheck',
  'Layers',
  'Sparkles',
  'Landmark',
  'Home',
  'Compass',
  'PenTool',
];

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentService, setCurrentService] = useState<Partial<Service>>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon_name: 'Building2',
    image_url: '',
    features: [''],
    display_order: 0,
    is_featured: true,
  });

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [supabase]);

  const handleStartCreate = () => {
    setCurrentService({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      icon_name: 'Building2',
      image_url: '',
      features: [''],
      display_order: services.length,
      is_featured: true,
    });
    setIsEditing(true);
  };

  const handleStartEdit = (service: Service) => {
    setCurrentService({
      ...service,
      features: service.features && service.features.length > 0 ? service.features : [''],
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService.title) return;

    setSaving(true);
    setFeedback(null);

    const slug =
      currentService.slug ||
      currentService.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const filteredFeatures = (currentService.features || []).filter((f) => f.trim().length > 0);

    const payload = {
      ...currentService,
      slug,
      features: filteredFeatures,
      updated_at: new Date().toISOString(),
    };

    try {
      if (currentService.id) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', currentService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }

      setFeedback({ type: 'success', message: 'Service discipline saved.' });
      setIsEditing(false);
      loadServices();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error saving service.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service discipline?')) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices(services.filter((s) => s.id !== id));
      setFeedback({ type: 'success', message: 'Service removed.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete service.',
      });
    }
  };

  if (loading) return <LoadingSpinner text="Loading Services..." />;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Disciplines
          </span>
          <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
            Construction Services
          </h1>
        </div>

        {!isEditing && (
          <Button
            variant="olive"
            size="sm"
            onClick={handleStartCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Discipline
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

      {/* Edit / Create Form Drawer */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-xl text-near-black">
              {currentService.id ? 'Edit Service Discipline' : 'New Service Discipline'}
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
                Service Title *
              </label>
              <input
                type="text"
                required
                value={currentService.title || ''}
                onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                placeholder="e.g. Luxury Residential Build"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Architectural Icon
              </label>
              <div className="flex items-center space-x-3">
                <select
                  value={currentService.icon_name || 'Building2'}
                  onChange={(e) => setCurrentService({ ...currentService, icon_name: e.target.value })}
                  className="flex-1 bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
                <div className="w-10 h-10 rounded-sm bg-sand/40 flex items-center justify-center text-olive shrink-0">
                  <IconResolver name={currentService.icon_name} className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Short Description (Card Summary) *
            </label>
            <textarea
              rows={2}
              required
              value={currentService.short_description || ''}
              onChange={(e) => setCurrentService({ ...currentService, short_description: e.target.value })}
              placeholder="Concise overview of engineering and execution capabilities..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Full Scope & Methodology Description
            </label>
            <textarea
              rows={4}
              value={currentService.full_description || ''}
              onChange={(e) => setCurrentService({ ...currentService, full_description: e.target.value })}
              placeholder="In-depth explanation of technical methods, equipment, and structural standards..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          {/* Features bullet array */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium">
              Capability Highlights / Features
            </label>
            {(currentService.features || []).map((feat, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => {
                    const feats = [...(currentService.features || [])];
                    feats[idx] = e.target.value;
                    setCurrentService({ ...currentService, features: feats });
                  }}
                  placeholder="e.g. Seismic Engineering Compliance"
                  className="flex-1 bg-sand/20 focus:bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const feats = (currentService.features || []).filter((_, i) => i !== idx);
                    setCurrentService({ ...currentService, features: feats });
                  }}
                  className="text-warm-grey hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setCurrentService({
                  ...currentService,
                  features: [...(currentService.features || []), ''],
                })
              }
              className="text-xs text-olive hover:underline font-medium inline-flex items-center mt-1"
            >
              + Add Feature Item
            </button>
          </div>

          <div className="pt-4 border-t border-sand flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="olive" size="sm" isLoading={saving}>
              Save Discipline
            </Button>
          </div>
        </form>
      ) : null}

      {/* Services Table */}
      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {services.length === 0 ? (
          <EmptyState
            title="No Services Configured"
            description="Add your construction disciplines and architectural service offerings to display them on the website."
            icon={Wrench}
            actionLabel="Add First Service"
            actionHref="#"
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3 px-6">Icon</th>
                <th className="py-3 px-6">Discipline Title</th>
                <th className="py-3 px-6">Short Description</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-8 h-8 rounded-sm bg-sand/40 text-olive flex items-center justify-center">
                      <IconResolver name={svc.icon_name} className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-near-black text-sm">
                    {svc.title}
                  </td>
                  <td className="py-4 px-6 text-warm-grey max-w-xs truncate">
                    {svc.short_description}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(svc)}
                      className="p-1.5 text-warm-grey hover:text-near-black"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(svc.id)}
                      className="p-1.5 text-warm-grey hover:text-red-700"
                      title="Delete Service"
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
