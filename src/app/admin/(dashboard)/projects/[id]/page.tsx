'use client';

import React, { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Project } from '@/lib/supabase/types';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = use(params);
  const supabase = createClient();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id, supabase]);

  if (loading) return <LoadingSpinner text="Loading Project Information..." />;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Edit Portfolio Milestone
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          Edit: {project.title}
        </h1>
      </div>

      <ProjectForm initialData={project} isEdit />
    </div>
  );
}
