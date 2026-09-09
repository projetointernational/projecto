'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconResolver } from '@/components/ui/IconResolver';
import { ProcessContent, WorkflowStep } from '@/lib/supabase/types';
import {
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Workflow,
  Eye,
} from 'lucide-react';

const COMMON_PROCESS_ICONS = [
  'Users',
  'Package',
  'Truck',
  'ShieldCheck',
  'FileText',
  'Clock',
  'Compass',
  'Layers',
  'Building2',
  'Wrench',
  'Award',
  'CheckCircle2',
  'Sparkles',
  'Handshake',
];

export default function AdminProcessPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [processData, setProcessData] = useState<Partial<ProcessContent>>({
    subtitle: '',
    title: '',
    description: '',
    steps: [],
    is_active: true,
  });

  useEffect(() => {
    async function loadProcessContent() {
      try {
        const { data, error } = await supabase
          .from('process_content')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setProcessData({
            ...data,
            steps: data.steps || [],
          });
        }
      } catch (err) {
        console.error('[AdminProcessPage] Error fetching process content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProcessContent();
  }, [supabase]);

  const handleAddStep = () => {
    const currentSteps = processData.steps || [];
    const newStep: WorkflowStep = {
      title: '',
      description: '',
      icon_name: 'Users',
    };
    setProcessData({
      ...processData,
      steps: [...currentSteps, newStep],
    });
  };

  const handleUpdateStep = (idx: number, field: keyof WorkflowStep, value: string) => {
    const currentSteps = [...(processData.steps || [])];
    currentSteps[idx] = {
      ...currentSteps[idx],
      [field]: value,
    };
    setProcessData({
      ...processData,
      steps: currentSteps,
    });
  };

  const handleRemoveStep = (idx: number) => {
    const currentSteps = (processData.steps || []).filter((_, i) => i !== idx);
    setProcessData({
      ...processData,
      steps: currentSteps,
    });
  };

  const handleMoveStep = (idx: number, direction: 'up' | 'down') => {
    const currentSteps = [...(processData.steps || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentSteps.length) return;

    const temp = currentSteps[idx];
    currentSteps[idx] = currentSteps[targetIdx];
    currentSteps[targetIdx] = temp;

    setProcessData({
      ...processData,
      steps: currentSteps,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      subtitle: processData.subtitle || '',
      title: processData.title || '',
      description: processData.description || '',
      steps: processData.steps || [],
      is_active: processData.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    try {
      if (processData.id) {
        const { error } = await supabase
          .from('process_content')
          .update(payload)
          .eq('id', processData.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('process_content')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) setProcessData(data);
      }

      setFeedback({ type: 'success', message: 'Process section successfully saved.' });
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

  if (loading) return <LoadingSpinner text="Loading Process Content..." />;

  const stepsList = processData.steps || [];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
          Homepage & Services Presentation
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
          What We Do / Process Editor
        </h1>
        <p className="text-xs text-warm-grey font-light mt-1">
          Manage the headline narrative and sequential workflow steps (Consultation, Procurement, Supply).
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-sm text-xs flex items-center space-x-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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
        {/* Section Header Settings */}
        <div className="bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <h2 className="font-serif text-lg text-near-black">
              Section Header & Narrative
            </h2>
            <label className="flex items-center space-x-2 text-xs text-warm-grey cursor-pointer">
              <input
                type="checkbox"
                checked={processData.is_active ?? true}
                onChange={(e) => setProcessData({ ...processData, is_active: e.target.checked })}
                className="rounded text-olive focus:ring-olive"
              />
              <span>Section Active & Visible</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Eyebrow / Subtitle
              </label>
              <input
                type="text"
                value={processData.subtitle || ''}
                onChange={(e) => setProcessData({ ...processData, subtitle: e.target.value })}
                placeholder="e.g. WHAT WE DO"
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
                Main Editorial Headline *
              </label>
              <input
                type="text"
                required
                value={processData.title || ''}
                onChange={(e) => setProcessData({ ...processData, title: e.target.value })}
                placeholder="e.g. Complete Procurement. Complete Confidence."
                className="w-full bg-sand/20 focus:bg-white text-sm px-4 py-2.5 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-warm-grey font-medium mb-2">
              Supporting Narrative / Description
            </label>
            <textarea
              rows={3}
              value={processData.description || ''}
              onChange={(e) => setProcessData({ ...processData, description: e.target.value })}
              placeholder="e.g. From consultation to supply, we make your project journey efficient and reliable."
              className="w-full bg-sand/20 focus:bg-white text-sm p-4 rounded-sm ring-1 ring-sand focus:ring-2 focus:ring-olive outline-none"
            />
          </div>
        </div>

        {/* Steps Manager */}
        <div className="bg-white p-8 sm:p-10 rounded-sm shadow-sm border border-sand/60 space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-4">
            <div>
              <h2 className="font-serif text-lg text-near-black">
                Workflow Steps
              </h2>
              <p className="text-[11px] text-warm-grey font-light">
                Configure the sequential columns displayed alongside the headline.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Step
            </Button>
          </div>

          {stepsList.length === 0 ? (
            <EmptyState
              title="No Workflow Steps Added"
              description="Click 'Add Step' above to configure steps such as Consultation, Procurement, and Project Supply."
              icon={Workflow}
              compact
            />
          ) : (
            <div className="space-y-4">
              {stepsList.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-sand/15 rounded-sm border border-sand/50 space-y-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-warm-beige bg-near-black px-2 py-0.5 rounded-sm">
                        Step 0{idx + 1}
                      </span>
                    </div>

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

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    {/* Icon Selection */}
                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="block text-[11px] uppercase tracking-wider text-warm-grey font-medium">
                        Icon
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          value={step.icon_name || 'Users'}
                          onChange={(e) => handleUpdateStep(idx, 'icon_name', e.target.value)}
                          className="flex-1 bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none"
                        >
                          {COMMON_PROCESS_ICONS.map((ic) => (
                            <option key={ic} value={ic}>
                              {ic}
                            </option>
                          ))}
                        </select>
                        <div className="w-9 h-9 rounded-sm bg-sand/30 flex items-center justify-center text-near-black shrink-0 border border-sand/60">
                          <IconResolver name={step.icon_name} className="w-4 h-4" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>

                    {/* Step Title */}
                    <div className="sm:col-span-8 space-y-1.5">
                      <label className="block text-[11px] uppercase tracking-wider text-warm-grey font-medium">
                        Step Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={step.title}
                        onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                        placeholder="e.g. Consultation"
                        className="w-full bg-white text-xs px-3 py-2 rounded-sm ring-1 ring-sand focus:ring-olive outline-none font-medium text-near-black"
                      />
                    </div>

                    {/* Step Description */}
                    <div className="sm:col-span-12 space-y-1.5">
                      <label className="block text-[11px] uppercase tracking-wider text-warm-grey font-medium">
                        Step Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={step.description}
                        onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                        placeholder="e.g. Understanding your needs with expertise."
                        className="w-full bg-white text-xs p-3 rounded-sm ring-1 ring-sand focus:ring-olive outline-none text-near-black"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Visual Preview (if title or steps exist) */}
        {(processData.title || stepsList.length > 0) && (
          <div className="bg-white p-8 rounded-sm shadow-sm border border-sand/60 space-y-4">
            <div className="flex items-center space-x-2 text-xs text-warm-grey uppercase tracking-wider font-medium">
              <Eye className="w-4 h-4 text-olive" />
              <span>Section Visual Layout Preview</span>
            </div>

            <div className="p-6 bg-off-white rounded-sm border border-sand/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Preview */}
                <div className="lg:col-span-5 space-y-3">
                  {processData.subtitle && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-olive" />
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-warm-grey">
                        {processData.subtitle}
                      </span>
                    </div>
                  )}
                  <h3 className="font-serif text-2xl text-near-black font-normal leading-tight">
                    {processData.title || 'Section Headline'}
                  </h3>
                  <div className="w-10 h-0.5 bg-warm-beige" />
                  {processData.description && (
                    <p className="text-xs text-warm-grey font-light leading-relaxed">
                      {processData.description}
                    </p>
                  )}
                </div>

                {/* Right Steps Preview */}
                <div className="lg:col-span-7">
                  <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(stepsList.length || 1, 3)} divide-y sm:divide-y-0 sm:divide-x divide-sand/60 gap-4 sm:gap-0`}>
                    {stepsList.map((step, i) => (
                      <div key={i} className="sm:px-4 first:sm:pl-0 last:sm:pr-0 space-y-3">
                        <div className="text-warm-beige">
                          <IconResolver name={step.icon_name} className="w-7 h-7 text-warm-beige" strokeWidth={1.25} />
                        </div>
                        <h4 className="text-sm font-semibold text-near-black">
                          {step.title || 'Step Title'}
                        </h4>
                        <p className="text-xs text-warm-grey font-light leading-relaxed">
                          {step.description || 'Step description text...'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="olive" size="md" isLoading={saving}>
            Save Process Section
          </Button>
        </div>
      </form>
    </div>
  );
}
