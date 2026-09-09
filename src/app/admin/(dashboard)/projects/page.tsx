'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Project } from '@/lib/supabase/types';
import { Building2, Plus, Edit3, Trash2, ExternalLink, Star } from 'lucide-react';

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [supabase]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setFeedback(`Project "${title}" deleted.`);
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Projects Catalog..." />;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Portfolio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
            Projects Catalog
          </h1>
        </div>

        <Button
          href="/admin/projects/new"
          variant="olive"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Project
        </Button>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 text-green-800 text-xs rounded-sm">
          {feedback}
        </div>
      )}

      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {projects.length === 0 ? (
          <EmptyState
            title="No Projects in Database"
            description="Start building your architectural portfolio by adding projects with photography, specifications, and narratives."
            icon={Building2}
            actionHref="/admin/projects/new"
            actionLabel="Add Your First Project"
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3.5 px-6">Visual</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-3 px-6">
                    <div className="relative w-14 h-10 rounded-sm overflow-hidden bg-sand shrink-0">
                      {p.main_image_url ? (
                        <Image
                          src={p.main_image_url}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-warm-grey">
                          None
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 font-medium text-near-black text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{p.title}</span>
                      {p.is_featured && (
                        <Star className="w-3.5 h-3.5 text-warm-beige fill-warm-beige" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-warm-grey">
                    {p.category_name || '—'}
                  </td>
                  <td className="py-3 px-6 text-warm-grey">
                    {p.location || '—'}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-block px-2 py-0.5 rounded-sm bg-sand text-near-black text-[10px] uppercase tracking-wider">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right space-x-3">
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="text-warm-grey hover:text-near-black inline-flex p-1"
                      title="View on Live Site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-warm-grey hover:text-olive inline-flex p-1"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
                      className="text-warm-grey hover:text-red-700 p-1"
                      title="Delete Project"
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
