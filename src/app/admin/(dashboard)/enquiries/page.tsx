'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Enquiry } from '@/lib/supabase/types';
import { MailCheck, Trash2, Eye, X, Phone, Mail, Calendar, Check, AlertCircle } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [supabase]);

  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'completed') => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      if (activeEnquiry && activeEnquiry.id === id) {
        setActiveEnquiry({ ...activeEnquiry, status: newStatus });
      }
      setFeedback(`Status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;

    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) throw error;
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (activeEnquiry?.id === id) setActiveEnquiry(null);
      setFeedback('Enquiry record deleted.');
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  const filteredEnquiries =
    filter === 'all'
      ? enquiries
      : enquiries.filter((e) => e.status === filter);

  if (loading) return <LoadingSpinner text="Loading Inbound Enquiries..." />;

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Lead Intake
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-near-black font-normal mt-1">
            Project Enquiries Pipeline
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 bg-sand/40 p-1 rounded-sm text-xs">
          {(['all', 'new', 'contacted', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-medium transition-colors ${filter === tab
                  ? 'bg-white text-near-black shadow-sm'
                  : 'text-warm-grey hover:text-near-black'
                }`}
            >
              {tab} ({tab === 'all' ? enquiries.length : enquiries.filter((e) => e.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 text-green-800 text-xs rounded-sm">
          {feedback}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-sm shadow-sm border border-sand/60 overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <EmptyState
            title="No Enquiries Found"
            description="When clients submit enquiries through the website or contact page, they will appear here."
            icon={MailCheck}
            compact
          />
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand text-warm-grey uppercase tracking-wider bg-sand/20">
                <th className="py-3.5 px-6">Client Name</th>
                <th className="py-3.5 px-6">Contact Coordinates</th>
                <th className="py-3.5 px-6">Project Scope</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Submitted</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-sand/10 transition-colors">
                  <td className="py-4 px-6 font-medium text-near-black text-sm">
                    {enq.name}
                  </td>
                  <td className="py-4 px-6 text-warm-grey">
                    <div>{enq.email}</div>
                    {enq.phone && <div className="text-[11px] text-warm-grey/70">{enq.phone}</div>}
                  </td>
                  <td className="py-4 px-6 text-near-black">
                    {enq.service_type || 'General Consultation'}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={enq.status}
                      disabled={updating}
                      onChange={(e) =>
                        handleUpdateStatus(
                          enq.id,
                          e.target.value as 'new' | 'contacted' | 'completed'
                        )
                      }
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-sm border-0 cursor-pointer outline-none ${enq.status === 'new'
                          ? 'bg-olive text-white'
                          : enq.status === 'contacted'
                            ? 'bg-warm-beige text-white'
                            : 'bg-sand text-near-black'
                        }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-warm-grey font-mono text-[11px]">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveEnquiry(enq)}
                      className="p-1.5 text-warm-grey hover:text-near-black"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(enq.id)}
                      className="p-1.5 text-warm-grey hover:text-red-700"
                      title="Delete Record"
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

      {/* Enquiry Detail Modal / Drawer */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-near-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-sm shadow-xl p-8 sm:p-10 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveEnquiry(null)}
              className="absolute top-6 right-6 text-warm-grey hover:text-near-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-olive font-mono">
                  Enquiry ID: {activeEnquiry.id}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-near-black font-normal">
                {activeEnquiry.name}
              </h2>
              <p className="text-xs text-warm-grey flex items-center space-x-1 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Received {new Date(activeEnquiry.created_at).toLocaleString()}
                </span>
              </p>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-sand/20 rounded-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-warm-grey font-medium flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-olive" />
                  <span>Email</span>
                </span>
                <a
                  href={`mailto:${activeEnquiry.email}`}
                  className="text-sm font-medium text-near-black hover:underline"
                >
                  {activeEnquiry.email}
                </a>
              </div>

              {activeEnquiry.phone && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-warm-grey font-medium flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-olive" />
                    <span>Phone</span>
                  </span>
                  <a
                    href={`tel:${activeEnquiry.phone}`}
                    className="text-sm font-medium text-near-black hover:underline"
                  >
                    {activeEnquiry.phone}
                  </a>
                </div>
              )}

              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-sand/40">
                <span className="text-[10px] uppercase tracking-wider text-warm-grey font-medium">
                  Requested Project Discipline
                </span>
                <p className="text-sm font-medium text-near-black">
                  {activeEnquiry.service_type || 'General Architectural Brief'}
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs uppercase tracking-wider text-warm-grey font-medium block mb-2">
                Project Scope & Client Message
              </span>
              <div className="p-5 bg-sand/30 rounded-sm text-sm text-near-black leading-relaxed whitespace-pre-wrap">
                {activeEnquiry.message}
              </div>
            </div>

            {/* Status Control in Modal */}
            <div className="pt-4 border-t border-sand flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-warm-grey uppercase tracking-wider font-medium">
                  Status:
                </span>
                <div className="flex space-x-2">
                  {(['new', 'contacted', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(activeEnquiry.id, st)}
                      className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm font-medium transition-all ${activeEnquiry.status === st
                          ? 'bg-olive text-white shadow-sm'
                          : 'bg-sand/40 text-warm-grey hover:bg-sand'
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveEnquiry(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
