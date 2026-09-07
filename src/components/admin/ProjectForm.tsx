'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { ProjectGalleryManager } from '@/components/admin/ProjectGalleryManager';
import { Project, Category } from '@/lib/supabase/types';
import { Check, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProjectFormProps {
  initialData?: Project | null;
  isEdit?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category_id: initialData?.category_id || '',
    category_name: initialData?.category_name || '',
    short_description: initialData?.short_description || '',
    full_description: initialData?.full_description || '',
    main_image_url: initialData?.main_image_url || '',
    gallery_images: initialData?.gallery_images || [],
    client: initialData?.client || '',
    location: initialData?.location || '',
    year: initialData?.year || new Date().getFullYear().toString(),
    area: initialData?.area || '',
    status: initialData?.status || 'Completed',
    is_featured: initialData?.is_featured ?? false,
    display_order: initialData?.display_order || 0,
  });

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    }
    loadCategories();
  }, [supabase]);

  const handleTitleChange = (val: string) => {
    const slug = isEdit
      ? formData.slug
      : val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slug || prev.slug,
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const selected = categories.find((c) => c.id === categoryId);
    setFormData((prev) => ({
      ...prev,
      category_id: categoryId || null,
      category_name: selected?.name || null,
    }));
  };

  const handleGalleryChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: images,
    }));
  };

  const handleSetMainImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      main_image_url: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.main_image_url) {
      setFeedback({
        type: 'error',
        message: 'Please provide at least a Project Title and Main Image URL.',
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      ...formData,
      slug:
        formData.slug ||
        formData.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-'),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEdit && initialData?.id) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }

      setFeedback({
        type: 'success',
        message: isEdit ? 'Project updated successfully.' : 'Project published successfully.',
      });

      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save project.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-xs uppercase tracking-wider text-warm-grey hover:text-near-black space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
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

      <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-sand/60 space-y-8">
        {/* Core Info */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-near-black border-b border-sand pb-3">
            Architectural Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Lumina Pavilion & Residence"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                URL Identifier / Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Category
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Project Status
              </label>
              <select
                value={formData.status || 'Completed'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none cursor-pointer"
              >
                <option value="Completed">Completed</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Pre-Construction">Pre-Construction</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 text-xs uppercase tracking-wider text-near-black font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-olive focus:ring-olive w-4 h-4"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Short Description (Card Summary) *
            </label>
            <textarea
              rows={2}
              required
              value={formData.short_description || ''}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Concise overview of architectural form, materials, and significance..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Full Architectural Narrative & Technical Scope
            </label>
            <textarea
              rows={5}
              value={formData.full_description || ''}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="In-depth breakdown of structural methods, foundation engineering, envelope design..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none resize-y"
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-6 pt-4 border-t border-sand">
          <h2 className="font-serif text-xl text-near-black border-b border-sand pb-3">
            Specifications Matrix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Aspen, CO"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Year Completed
              </label>
              <input
                type="text"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g. 2024"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Client / Architectural Partner
              </label>
              <input
                type="text"
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Private Client"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Gross Area
              </label>
              <input
                type="text"
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. 14,200 sq ft"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>
        </div>

        {/* Media & Cloudinary Imagery */}
        <div className="space-y-6 pt-4 border-t border-sand">
          <h2 className="font-serif text-xl text-near-black border-b border-sand pb-3">
            Imagery (Cloudinary Media)
          </h2>

          <div>
            <CloudinaryUploader
              label="Primary Architectural Milestone Visual *"
              currentImageUrl={formData.main_image_url}
              onUploadSuccess={(url) => setFormData({ ...formData, main_image_url: url })}
              aspectRatio="wide"
              folder="projects"
            />
          </div>

          <div className="pt-2">
            <ProjectGalleryManager
              galleryImages={formData.gallery_images || []}
              onChange={handleGalleryChange}
              onSetMainImage={handleSetMainImage}
              mainImageUrl={formData.main_image_url}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-sand flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.push('/admin/projects')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="olive"
            size="md"
            isLoading={saving}
          >
            {isEdit ? 'Update Project' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};
