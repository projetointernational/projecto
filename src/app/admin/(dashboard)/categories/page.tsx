'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Category } from '@/lib/supabase/types';
import { Tag, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    const slug = newCategoryName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      const { error } = await supabase.from('categories').insert([
        {
          name: newCategoryName.trim(),
          slug,
          display_order: categories.length,
        },
      ]);

      if (error) throw error;

      setNewCategoryName('');
      setFeedback({ type: 'success', message: 'Category added successfully.' });
      loadCategories();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to create category.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
      setFeedback({ type: 'success', message: 'Category deleted.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete category.',
      });
    }
  };

  if (loading) return <LoadingSpinner text="Loading Categories..." />;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Taxonomy
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          Project Categories
        </h1>
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

      {/* Quick Add Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-sm shadow-sm border border-sand/60 flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            required
            placeholder="e.g. Luxury Residential, Commercial, Renovation"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
          />
        </div>
        <Button
          type="submit"
          variant="olive"
          size="md"
          isLoading={submitting}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Category
        </Button>
      </form>

      {/* Categories List */}
      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {categories.length === 0 ? (
          <EmptyState
            title="No Categories Configured"
            description="Create project categories like 'Residential', 'Commercial', or 'Adaptive Reuse' to organize your portfolio."
            icon={Tag}
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3 px-6">Order</th>
                <th className="py-3 px-6">Category Name</th>
                <th className="py-3 px-6">URL Slug</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-3 px-6 text-warm-grey font-mono">0{idx + 1}</td>
                  <td className="py-3 px-6 font-medium text-near-black text-sm">{cat.name}</td>
                  <td className="py-3 px-6 text-warm-grey font-mono">{cat.slug}</td>
                  <td className="py-3 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="text-warm-grey hover:text-red-700 p-1.5 transition-colors"
                      title="Delete Category"
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
