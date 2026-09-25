'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProcessContent, WorkflowStep } from '@/lib/supabase/types';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import {
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Workflow,
} from 'lucide-react';

// Step limits per process type
const getStepLimit = (subtitle?: string, title?: string): number => {
  const sub = (subtitle || '').toUpperCase();
  const ttl = (title || '').toLowerCase();
  if (sub === 'PROCUREMENT' || ttl.includes('requirement') || ttl.includes('delivery')) return 7;
  if (sub === 'PROJECT WORKFLOW' || ttl.includes('completion')) return 7;
  return 9; // Coordination Support and others
};

export default function AdminProcessPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [allProcesses, setAllProcesses] = useState<ProcessContent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [procurementImageUrl, setProcurementImageUrl] = useState<string>('');
  const [procurementMobileImageUrl, setProcurementMobileImageUrl] = useState<string>('');

  const [activeProcess, setActiveProcess] = useState<Partial<ProcessContent>>({
    subtitle: '',
    title: '',
    description: '',
    steps: [],
    is_active: true,
  });

  const loadProcesses = async () => {
    try {
      const { data, error } = await supabase
        .from('process_content')
        .select('*')
        .order('updated_at', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setAllProcesses(data);
        const idx = Math.min(selectedIndex, data.length - 1);
        setActiveProcess(data[idx]);
      }

      // Load current procurement section images
      const { data: svcData } = await supabase
        .from('services')
        .select('image_url')
        .eq('slug', 'procurement')
        .maybeSingle();
      if (svcData?.image_url) {
        setProcurementImageUrl(svcData.image_url);
      } else {
        const { data: sData } = await supabase.from('site_settings').select('navigation_labels').single();
        if (sData?.navigation_labels?.section_images?.procurement_section_image) {
          setProcurementImageUrl(sData.navigation_labels.section_images.procurement_section_image);
        }
      }

      const { data: sData } = await supabase.from('site_settings').select('navigation_labels').single();
      const sImgs = sData?.navigation_labels?.section_images;
      if (sImgs?.procurement_mobile_section_image) {
        setProcurementMobileImageUrl(sImgs.procurement_mobile_section_image);
      }
    } catch (err) {
      console.error('[AdminProcessPage] Error fetching processes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProcesses();
  }, [supabase]);

  const handleSelectProcess = (index: number) => {
    setSelectedIndex(index);
    setActiveProcess(allProcesses[index]);
    setFeedback(null);
  };

  const handleCreateNewCollection = () => {
    const newRecord: Partial<ProcessContent> = {
      subtitle: 'NEW PROCESS',
      title: 'New Process Title',
      description: 'Process collection description.',
      steps: [
        { title: 'Step 01', description: 'Description of step', icon_name: 'FileText' },
      ],
      is_active: true,
    };
    setActiveProcess(newRecord);
    setSelectedIndex(allProcesses.length);
    setFeedback({ type: 'success', message: 'Configuring new process collection. Click Save to persist.' });
  };

  const handleAddStep = () => {
    const currentSteps = activeProcess.steps || [];
    const limit = getStepLimit(activeProcess.subtitle ?? undefined, activeProcess.title ?? undefined);
    if (currentSteps.length >= limit) return; // already at limit
    const newStep: WorkflowStep = {
      title: '',
      description: '',
    };
    setActiveProcess({
      ...activeProcess,
      steps: [...currentSteps, newStep],
    });
  };

  const handleUpdateStep = (idx: number, field: keyof WorkflowStep, value: string) => {
    const currentSteps = [...(activeProcess.steps || [])];
    currentSteps[idx] = {
      ...currentSteps[idx],
      [field]: value,
    };
    setActiveProcess({
      ...activeProcess,
      steps: currentSteps,
    });
  };

  const handleRemoveStep = (idx: number) => {
    const currentSteps = (activeProcess.steps || []).filter((_, i) => i !== idx);
    setActiveProcess({
      ...activeProcess,
      steps: currentSteps,
    });
  };

  const handleMoveStep = (idx: number, direction: 'up' | 'down') => {
    const currentSteps = [...(activeProcess.steps || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentSteps.length) return;

    const temp = currentSteps[idx];
    currentSteps[idx] = currentSteps[targetIdx];
    currentSteps[targetIdx] = temp;

    setActiveProcess({
      ...activeProcess,
      steps: currentSteps,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      subtitle: activeProcess.subtitle || '',
      title: activeProcess.title || '',
      description: activeProcess.description || '',
      steps: activeProcess.steps || [],
      is_active: activeProcess.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    try {
      if (activeProcess.id) {
        const { error } = await supabase
          .from('process_content')
          .update(payload)
          .eq('id', activeProcess.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('process_content')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) setActiveProcess(data);
      }

      // Save section supporting image ONLY if active process is strictly the Procurement section (never Project Workflow)
      const subUpper = (activeProcess.subtitle || '').trim().toUpperCase();
      const ttlLower = (activeProcess.title || '').trim().toLowerCase();
      const isWorkflow = subUpper === 'PROJECT WORKFLOW' || ttlLower.includes('completion');
      const isProcurement = !isWorkflow && (subUpper === 'PROCUREMENT' || ttlLower.includes('delivery'));

      if (isProcurement) {
        try {
          await supabase
            .from('services')
            .update({ image_url: procurementImageUrl })
            .eq('slug', 'procurement');

          const { data: sData } = await supabase.from('site_settings').select('id, navigation_labels').single();
          if (sData) {
            const nav = sData.navigation_labels || {};
            nav.section_images = {
              ...(nav.section_images || {}),
              procurement_section_image: procurementImageUrl,
              procurement_mobile_section_image: procurementMobileImageUrl,
            };
            await supabase.from('site_settings').update({ navigation_labels: nav }).eq('id', sData.id);
          }
        } catch (imgErr) {
          console.warn('Procurement image sync warning:', imgErr);
        }
      }

      setFeedback({ type: 'success', message: 'Process collection successfully saved to database.' });
      await loadProcesses();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      const rawMessage = errorObj?.message || (err instanceof Error ? err.message : 'Failed to update process section.');
      setFeedback({
        type: 'error',
        message: rawMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Process Workflows..." />;

  const stepsList = activeProcess.steps || [];
  const subtitleUpper = (activeProcess.subtitle || '').trim().toUpperCase();
  const titleLower = (activeProcess.title || '').trim().toLowerCase();
  const isProjectWorkflow = subtitleUpper === 'PROJECT WORKFLOW' || titleLower.includes('completion');
  const isProcurementProcess = !isProjectWorkflow && (subtitleUpper === 'PROCUREMENT' || titleLower.includes('delivery'));

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Homepage & Subpage Presentation
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          Workflows & Process Collections Manager
        </h1>
        <p className="text-xs text-warm-grey font-light mt-1">
          Manage the 7-step Procurement Process, 9-stage Coordination Support, and 7-stage Core Project Workflow.
        </p>
      </div>

      {/* Process Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sand pb-4">
        {allProcesses.map((proc, idx) => (
          <button
            key={proc.id || idx}
            type="button"
            onClick={() => handleSelectProcess(idx)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors ${
              selectedIndex === idx
                ? 'bg-olive text-white shadow-xs'
                : 'bg-white text-near-black hover:bg-sand/40 border border-sand/70'
            }`}
          >
            {proc.subtitle || proc.title || `Workflow 0${idx + 1}`}
          </button>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCreateNewCollection}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Collection
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center space-x-2 ${
            feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-lg text-near-black">
              Collection Identity & Visibility
            </h2>
            <label className="flex items-center space-x-2 text-xs text-warm-grey cursor-pointer">
              <input
                type="checkbox"
                checked={activeProcess.is_active ?? true}
                onChange={(e) => setActiveProcess({ ...activeProcess, is_active: e.target.checked })}
                className="rounded text-olive focus:ring-olive"
              />
              <span>Active & Visible on Website</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Eyebrow / Subtitle (e.g. PROCUREMENT, PROJECT WORKFLOW)
              </label>
              <input
                type="text"
                value={activeProcess.subtitle || ''}
                onChange={(e) => setActiveProcess({ ...activeProcess, subtitle: e.target.value })}
                placeholder="e.g. PROCUREMENT"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Main Headline *
              </label>
              <input
                type="text"
                required
                value={activeProcess.title || ''}
                onChange={(e) => setActiveProcess({ ...activeProcess, title: e.target.value })}
                placeholder="e.g. From Requirement to Delivery. Coordinated."
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Supporting Narrative / Scope Note
            </label>
            <textarea
              rows={3}
              value={activeProcess.description || ''}
              onChange={(e) => setActiveProcess({ ...activeProcess, description: e.target.value })}
              placeholder="e.g. The sequence may vary by project. Projeto acts as a central coordination point..."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>

          {/* Section Supporting Image Control for Procurement Workflow ONLY (Completely excluded for Project Workflow) */}
          {isProcurementProcess && (
            <div className="pt-6 border-t border-sand space-y-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-olive font-semibold block mb-1">
                  PROCUREMENT PROCESS
                </span>
                <h3 className="font-serif text-lg text-near-black font-normal">
                  &ldquo;From Requirement to Delivery. Coordinated.&rdquo; Section Supporting Imagery
                </h3>
                <p className="text-xs text-warm-grey font-light mt-0.5">
                  Manage supporting visuals for desktop (4:3 landscape) and mobile (16:9 landscape) viewports.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desktop Supporting Image (Ratio: 4:3 Landscape) */}
                <div className="p-5 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-near-black font-semibold">
                        Desktop Supporting Image
                      </h4>
                      <span className="text-[11px] text-warm-grey font-mono">
                        Ratio: 4:3 Landscape
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sand/60 text-near-black/70 rounded-xs">
                      Desktop Viewport
                    </span>
                  </div>

                  <CloudinaryUploader
                    label=""
                    currentImageUrl={procurementImageUrl}
                    onUploadSuccess={(url) => setProcurementImageUrl(url)}
                    aspectRatio="classic"
                    compact={false}
                    folder="procurement"
                  />

                  <div className="text-[11px] text-warm-grey leading-relaxed">
                    Recommended upload ratio: <strong className="text-near-black">4:3 (Landscape)</strong>. Occupies approximately 45% of the split layout beside the process steps on desktop.
                  </div>
                </div>

                {/* Mobile Supporting Image (Ratio: 16:9 Landscape) */}
                <div className="p-5 bg-sand/20 rounded-sm border border-sand/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-near-black font-semibold">
                        Mobile Supporting Image
                      </h4>
                      <span className="text-[11px] text-warm-grey font-mono">
                        Ratio: 16:9 Landscape
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sand/60 text-near-black/70 rounded-xs">
                      Mobile Viewport
                    </span>
                  </div>

                  <CloudinaryUploader
                    label=""
                    currentImageUrl={procurementMobileImageUrl}
                    onUploadSuccess={(url) => setProcurementMobileImageUrl(url)}
                    aspectRatio="video"
                    compact={false}
                    folder="procurement"
                  />

                  <div className="text-[11px] text-warm-grey leading-relaxed">
                    Recommended upload ratio: <strong className="text-near-black">16:9 (Landscape)</strong>. Appears above the process steps on mobile devices.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Steps Manager */}
        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <div>
              <h2 className="font-serif text-lg text-near-black">
                Process Steps ({stepsList.length} / {getStepLimit(activeProcess.subtitle ?? undefined, activeProcess.title ?? undefined)})
              </h2>
              <p className="text-[11px] text-warm-grey font-light">
                Configure sequential stages. You can reorder, change titles and descriptions.{' '}
                <span className="text-olive font-medium">
                  Max {getStepLimit(activeProcess.subtitle ?? undefined, activeProcess.title ?? undefined)} steps for this process.
                </span>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              disabled={stepsList.length >= getStepLimit(activeProcess.subtitle ?? undefined, activeProcess.title ?? undefined)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Step
            </Button>
          </div>

          {stepsList.length === 0 ? (
            <EmptyState
              title="No Steps in Collection"
              description="Click 'Add Step' above to configure steps."
              icon={Workflow}
              compact
            />
          ) : (
            <div className="space-y-4">
              {stepsList.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-sand/15 rounded-sm border border-sand/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-warm-beige bg-near-black px-2 py-0.5 rounded-sm">
                      Step 0{idx + 1}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleMoveStep(idx, 'up')}
                        disabled={idx === 0}
                        aria-label="Move step up"
                        className="p-1.5 text-warm-grey hover:text-near-black disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStep(idx, 'down')}
                        disabled={idx === stepsList.length - 1}
                        aria-label="Move step down"
                        className="p-1.5 text-warm-grey hover:text-near-black disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        aria-label="Delete step"
                        className="p-1.5 text-warm-grey hover:text-red-600 transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Step Title */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] uppercase tracking-wider text-warm-grey font-medium">
                        Step Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={step.title}
                        onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                        placeholder="e.g. BOQ / REQUIREMENT"
                        className="w-full bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none font-semibold text-near-black uppercase"
                      />
                    </div>

                    {/* Step Description */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] uppercase tracking-wider text-warm-grey font-medium">
                        Step Description
                      </label>
                      <input
                        type="text"
                        value={step.description || ''}
                        onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                        placeholder="e.g. Requirement analysis and BOQ review"
                        className="w-full bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none text-near-black"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="olive" size="md" isLoading={saving}>
            Save Process Collection
          </Button>
        </div>
      </form>
    </div>
  );
}
