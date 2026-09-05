'use client';

import React from 'react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Catalog Creation
        </span>
        <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
          Publish New Project
        </h1>
      </div>

      <ProjectForm />
    </div>
  );
}
