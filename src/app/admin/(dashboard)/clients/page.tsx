'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CloudinaryUploader } from '@/components/ui/CloudinaryUploader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Client } from '@/lib/supabase/types';
import {
  Handshake,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  X,
  Copy,
  CheckCircle2,
  Building,
} from 'lucide-react';

export default function AdminClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
          setTableMissing(true);
        }
        throw error;
      }
      setTableMissing(false);
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [supabase]);

  const handleStartCreate = () => {
    setCurrentLogoUrl('');
    setFeedback(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLogoUrl?.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please upload a client logo image before saving.',
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = {
      logo_url: currentLogoUrl.trim(),
    };

    try {
      const { error } = await supabase
        .from('clients')
        .insert([payload]);
      if (error) throw error;

      setFeedback({ type: 'success', message: 'Client logo uploaded successfully.' });
      setIsEditing(false);
      loadClients();
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: string };
      setFeedback({
        type: 'error',
        message: errorObj?.message || 'Failed to save client logo.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this client logo?')) return;
    setDeletingId(id);
    setFeedback(null);

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      setFeedback({ type: 'success', message: 'Client logo removed successfully.' });
      loadClients();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setFeedback({
        type: 'error',
        message: errorObj?.message || 'Failed to delete client logo.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const sqlMigration = `-- Run this in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove unwanted columns from existing table:
ALTER TABLE clients 
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS website_url,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS is_active,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Clients" ON clients;
DROP POLICY IF EXISTS "Admin All Clients" ON clients;

CREATE POLICY "Public Read Clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Admin All Clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT ALL ON TABLE clients TO anon, authenticated, service_role;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlMigration);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  if (loading) return <LoadingSpinner text="Loading Client Directory..." />;

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-grey/15 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey font-medium">
            Partners And Brand Identity
          </span>
          <h1 className="font-serif text-3xl text-near-black font-normal mt-1">
            Clients And Partners
          </h1>
          <p className="text-xs text-warm-grey mt-1">
            Upload client brand logos showcased on the homepage continuous ticker.
          </p>
        </div>

        <Button
          onClick={handleStartCreate}
          variant="olive"
          size="sm"
          icon={<Plus className="w-4 h-4 shrink-0" strokeWidth={2} />}
          iconPosition="left"
          className="whitespace-nowrap shrink-0"
        >
          Add Client Logo
        </Button>
      </div>

      {/* Missing Table Notice */}
      {tableMissing && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-sm space-y-3">
          <div className="flex items-center space-x-2.5 text-amber-900 font-medium text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Supabase &apos;clients&apos; table not created yet</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Run the following SQL migration in your <strong>Supabase SQL Editor</strong> to initialize the clients table with Row Level Security:
          </p>
          <div className="relative">
            <pre className="p-3 bg-white/90 border border-amber-200 text-xs font-mono text-near-black rounded-sm overflow-x-auto">
              {sqlMigration}
            </pre>
            <button
              type="button"
              onClick={copySqlToClipboard}
              className="absolute top-2 right-2 inline-flex items-center space-x-1.5 px-2.5 py-1 bg-near-black text-white text-[11px] rounded-sm hover:bg-olive transition-colors"
            >
              {copiedSql ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-sm flex items-center space-x-3 text-xs tracking-wide transition-all ${
            feedback.type === 'success'
              ? 'bg-olive/10 text-olive border border-olive/20'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Create Modal - Compact & Logo Only */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-hidden !m-0">
          <div className="bg-[#FAF8F5] border border-warm-grey/20 rounded-sm max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-warm-grey/15 px-5 py-3.5 bg-[#FAF8F5] shrink-0">
              <div className="flex items-center space-x-2.5">
                <Building className="w-4 h-4 text-olive" strokeWidth={1.5} />
                <h2 className="font-serif text-lg text-near-black">
                  Add Client Logo
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 text-warm-grey hover:text-near-black transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex flex-col">
              <div className="p-5 space-y-3">
                <CloudinaryUploader
                  currentImageUrl={currentLogoUrl}
                  onUploadSuccess={(url) => setCurrentLogoUrl(url)}
                  folder="clients"
                  aspectRatio="wide"
                  label="Upload Client Logo Image"
                />
                <p className="text-[11px] text-warm-grey font-light text-center">
                  Upload a PNG, SVG, or JPG with a transparent or clean background.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-2.5 px-5 py-3 border-t border-warm-grey/15 bg-[#F5F2EC] shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="olive"
                  size="sm"
                  disabled={saving || !currentLogoUrl}
                  isLoading={saving}
                  icon={!saving ? <Check className="w-4 h-4 shrink-0" strokeWidth={2} /> : undefined}
                  iconPosition="left"
                  className="whitespace-nowrap"
                >
                  Save Client Logo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <EmptyState
          title="No Client Logos Uploaded Yet"
          description="Upload client logos here. Once added, they will automatically scroll smoothly across your homepage under the 'OUR CLIENTS' section."
          icon={Handshake}
          onAction={handleStartCreate}
          actionLabel="Add First Client Logo"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="group relative bg-white border border-warm-grey/20 rounded-sm p-3 flex flex-col items-center justify-center shadow-xs hover:shadow-md transition-all duration-200"
            >
              {/* Logo Preview */}
              <div className="relative w-full h-24 bg-[#FAF8F5] border border-warm-grey/10 rounded-sm flex items-center justify-center p-2 overflow-hidden">
                <Image
                  src={client.logo_url}
                  alt="Client Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Delete Button */}
              <div className="w-full pt-2.5 mt-2 border-t border-warm-grey/10 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(client.id)}
                  disabled={deletingId === client.id}
                  className="p-1.5 text-warm-grey hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                  title="Remove client logo"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
