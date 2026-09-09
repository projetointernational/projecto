'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Testimonial } from '@/lib/supabase/types';
import { MessageSquareQuote, Plus, Trash2, Edit3, Check, AlertCircle, X, Star } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({
    client_name: '',
    client_title: '',
    company: '',
    quote: '',
    avatar_url: '',
    project_reference: '',
    rating: 5,
    is_active: true,
  });

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [supabase]);

  const handleStartCreate = () => {
    setCurrentTestimonial({
      client_name: '',
      client_title: '',
      company: '',
      quote: '',
      avatar_url: '',
      project_reference: '',
      rating: 5,
      is_active: true,
      display_order: testimonials.length,
    });
    setIsEditing(true);
  };

  const handleStartEdit = (t: Testimonial) => {
    setCurrentTestimonial(t);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial.client_name || !currentTestimonial.quote) return;

    setSaving(true);
    setFeedback(null);

    try {
      if (currentTestimonial.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(currentTestimonial)
          .eq('id', currentTestimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([currentTestimonial]);
        if (error) throw error;
      }

      setFeedback({ type: 'success', message: 'Testimonial saved successfully.' });
      setIsEditing(false);
      loadTestimonials();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save testimonial.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this testimonial?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials(testimonials.filter((t) => t.id !== id));
      setFeedback({ type: 'success', message: 'Testimonial removed.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error removing testimonial.',
      });
    }
  };

  if (loading) return <LoadingSpinner text="Loading Testimonials..." />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Client Verification
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
            Testimonials & Endorsements
          </h1>
        </div>

        {!isEditing && (
          <Button
            variant="olive"
            size="sm"
            onClick={handleStartCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Endorsement
          </Button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center space-x-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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
              {currentTestimonial.id ? 'Edit Client Testimonial' : 'New Client Testimonial'}
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
                Client / Partner Name *
              </label>
              <input
                type="text"
                required
                value={currentTestimonial.client_name || ''}
                onChange={(e) =>
                  setCurrentTestimonial({ ...currentTestimonial, client_name: e.target.value })
                }
                placeholder="e.g. Richard Hawthorne"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Title / Position
              </label>
              <input
                type="text"
                value={currentTestimonial.client_title || ''}
                onChange={(e) =>
                  setCurrentTestimonial({ ...currentTestimonial, client_title: e.target.value })
                }
                placeholder="e.g. Principal Architect"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Organization / Studio
              </label>
              <input
                type="text"
                value={currentTestimonial.company || ''}
                onChange={(e) =>
                  setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })
                }
                placeholder="e.g. Studio Hawthorne NY"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Project Reference
              </label>
              <input
                type="text"
                value={currentTestimonial.project_reference || ''}
                onChange={(e) =>
                  setCurrentTestimonial({
                    ...currentTestimonial,
                    project_reference: e.target.value,
                  })
                }
                placeholder="e.g. Lumina Pavilion & Residence"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Quote & Review *
            </label>
            <textarea
              rows={4}
              required
              value={currentTestimonial.quote || ''}
              onChange={(e) =>
                setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })
              }
              placeholder="Reflections on engineering rigor, structural honesty, and milestone compliance..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <CloudinaryUploader
              label="Client Avatar / Studio Logo (Cloudinary)"
              currentImageUrl={currentTestimonial.avatar_url}
              onUploadSuccess={(url) =>
                setCurrentTestimonial({ ...currentTestimonial, avatar_url: url })
              }
              aspectRatio="square"
              folder="testimonials"
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
              Save Endorsement
            </Button>
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {testimonials.length === 0 ? (
          <EmptyState
            title="No Client Endorsements Published"
            description="Add authentic endorsements and reviews from past project clients and architectural collaborators."
            icon={MessageSquareQuote}
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3 px-6">Client</th>
                <th className="py-3 px-6">Company / Title</th>
                <th className="py-3 px-6">Quote Snippet</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-4 px-6 font-medium text-near-black text-sm">
                    {t.client_name}
                  </td>
                  <td className="py-4 px-6 text-warm-grey">
                    {t.client_title} {t.company && `at ${t.company}`}
                  </td>
                  <td className="py-4 px-6 text-warm-grey max-w-sm truncate italic">
                    "{t.quote}"
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(t)}
                      className="p-1.5 text-warm-grey hover:text-near-black"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
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
