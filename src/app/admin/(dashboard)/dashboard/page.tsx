import React from 'react';
import Link from 'next/link';
import { createServerSideClient } from '@/lib/supabase/server';
import { MailCheck, Building2, Wrench, ArrowUpRight, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Enquiry } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let enquiriesCount = 0;
  let newEnquiriesCount = 0;
  let projectsCount = 0;
  let servicesCount = 0;
  let recentEnquiries: Enquiry[] = [];

  try {
    const supabase = await createServerSideClient();

    // Enquiries stats
    const { data: allEnquiries, count: totalEnq } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    recentEnquiries = allEnquiries || [];
    enquiriesCount = totalEnq || recentEnquiries.length;
    newEnquiriesCount = recentEnquiries.filter((e) => e.status === 'new').length;

    // Projects count
    const { count: projCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    projectsCount = projCount || 0;

    // Services count
    const { count: servCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });
    servicesCount = servCount || 0;
  } catch (err) {
    console.error('[AdminDashboard] Fetch error:', err);
  }

  return (
    <div className="space-y-10">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-warm-grey">
            Control Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-near-black font-normal mt-1">
            Projecto Administration
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            href="/admin/projects/new"
            variant="olive"
            size="sm"
            icon={<Plus className="w-4 h-4" strokeWidth={1.5} />}
          >
            New Project
          </Button>
          <Button
            href="/admin/services"
            variant="outline"
            size="sm"
          >
            Manage Services
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-sand/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-warm-grey font-medium">
              Total Enquiries
            </span>
            <div className="font-serif text-3xl text-near-black font-normal">
              {enquiriesCount}
            </div>
            {newEnquiriesCount > 0 && (
              <span className="text-[11px] text-olive font-medium">
                {newEnquiriesCount} awaiting review
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-sm bg-sand/40 text-olive flex items-center justify-center">
            <MailCheck className="w-6 h-6" strokeWidth={1.25} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-sand/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-warm-grey font-medium">
              Live Projects
            </span>
            <div className="font-serif text-3xl text-near-black font-normal">
              {projectsCount}
            </div>
            <Link
              href="/admin/projects"
              className="text-[11px] text-warm-grey hover:text-near-black inline-flex items-center space-x-0.5"
            >
              <span>Manage catalog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-sm bg-sand/40 text-olive flex items-center justify-center">
            <Building2 className="w-6 h-6" strokeWidth={1.25} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-sand/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-warm-grey font-medium">
              Published Disciplines
            </span>
            <div className="font-serif text-3xl text-near-black font-normal">
              {servicesCount}
            </div>
            <Link
              href="/admin/services"
              className="text-[11px] text-warm-grey hover:text-near-black inline-flex items-center space-x-0.5"
            >
              <span>View disciplines</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-sm bg-sand/40 text-olive flex items-center justify-center">
            <Wrench className="w-6 h-6" strokeWidth={1.25} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-sand/60 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-warm-grey font-medium">
              Database Sync
            </span>
            <div className="text-base text-near-black font-medium mt-1 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-700 animate-pulse" />
              <span>Realtime</span>
            </div>
            <span className="text-[11px] text-warm-grey">Supabase RLS active</span>
          </div>
          <div className="w-12 h-12 rounded-sm bg-sand/40 text-olive flex items-center justify-center font-mono text-xs">
            PG
          </div>
        </div>
      </div>

      {/* Recent Enquiries Section */}
      <div className="bg-white p-8 rounded-sm shadow-sm border border-sand/60 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-near-black font-normal">
              Recent Project Enquiries
            </h2>
            <p className="text-xs text-warm-grey font-light mt-1">
              Prospective client project submissions from the website intake form.
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs uppercase tracking-wider font-semibold text-olive hover:text-olive-hover transition-colors"
          >
            All Enquiries ({enquiriesCount})
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <EmptyState
            title="No Enquiries Received Yet"
            description="Submitted briefs will appear here and in your designated notifications inbox via Brevo transactional emails."
            icon={MailCheck}
            compact
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand text-warm-grey uppercase tracking-wider">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/50">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-sand/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-near-black">
                      {enq.name}
                    </td>
                    <td className="py-3.5 px-4 text-warm-grey">
                      <div>{enq.email}</div>
                      {enq.phone && <div className="text-[11px]">{enq.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-near-black">
                      {enq.service_type || 'General Consultation'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold ${
                          enq.status === 'new'
                            ? 'bg-olive text-white'
                            : enq.status === 'contacted'
                            ? 'bg-warm-beige text-white'
                            : 'bg-sand text-near-black'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-warm-grey font-mono text-[11px]">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="text-olive hover:text-olive-hover font-medium underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
