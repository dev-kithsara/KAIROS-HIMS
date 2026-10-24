import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  investigationApi,
  type InvestigationStatus,
} from '../api/investigation.api';

// ── Enterprise Clinical Color Tokens ─────────────────────────────────────────
const NAVY = '#1E2B5E';
const NAVY_SOFT = '#192651';
const BORDER = '#D8DCE8';
const TEXT = '#1A2447';
const BODY = '#3B4565';
const MUTED = '#6B7494';
const SURFACE = '#FFFFFF';

const InvestigatorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<InvestigationStatus | ''>('');
  const [severity, setSeverity] = useState('');
  const [due, setDue] = useState<'OVERDUE' | 'NEXT_7_DAYS' | 'NO_DATE' | ''>('');

  const params: Record<string, string> = {};
  if (search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (severity) params.severity = severity;
  if (due) params.due = due;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['investigation-dashboard', params],
    queryFn: () => investigationApi.dashboard(params),
  });

  const summary = data?.summary ?? {
    total: 0,
    drafts: 0,
    revision: 0,
    submitted: 0,
    overdue: 0,
  };
  const items = data?.items ?? [];

  const getStatusPill = (st: InvestigationStatus) => {
    const base =
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap';
    switch (st) {
      case 'DRAFT':
        return (
          <span className={`${base} bg-slate-50 text-slate-600 border-slate-200`}>
            Draft
          </span>
        );
      case 'REVISION_REQUESTED':
        return (
          <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>
            Revision
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className={`${base} bg-sky-50 text-sky-700 border-sky-200`}>
            Submitted
          </span>
        );
      case 'APPROVED':
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>
            Approved
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityColor = (sev: string) => {
    const map: Record<string, string> = {
      CRITICAL: '#DC2626',
      HIGH: '#EA580C',
      MEDIUM: '#CA8A04',
      LOW: '#16A34A',
    };
    return map[sev.toUpperCase()] ?? MUTED;
  };

  const filterStyle = {
    borderColor: BORDER,
    color: TEXT,
  };
  const filterClass =
    'w-full rounded-lg border bg-white px-3 py-2.5 text-[13px] transition-all focus:outline-none focus:ring-2 focus:ring-[#1E2B5E]';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <div
          className="animate-spin rounded-full h-10 w-10 border-[3px] border-t-transparent"
          style={{ borderColor: `${NAVY} transparent ${NAVY} ${NAVY}` }}
        />
        <p className="text-sm font-semibold tracking-wide" style={{ color: TEXT }}>
          Loading clinical investigation records…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 rounded-xl border border-red-200 bg-red-50 text-red-900 space-y-2">
        <div className="font-bold text-red-700">
          <span>Clinical Investigation Console Offline</span>
        </div>
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : 'Unable to synchronize assigned cases.'}
        </p>
      </div>
    );
  }

  const kpis = [
    { label: 'Total', value: summary.total, alert: false },
    { label: 'Drafts', value: summary.drafts, alert: false },
    { label: 'Revision', value: summary.revision, alert: summary.revision > 0 },
    { label: 'Submitted', value: summary.submitted, alert: false },
    { label: 'Overdue', value: summary.overdue, alert: summary.overdue > 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-12">
      {/* ── Console Header & KPI Strip ─────────────────────────────────────── */}
      <header
        className="rounded-2xl px-6 py-6 sm:px-7 sm:py-7 text-white shadow-sm"
        style={{ backgroundColor: NAVY, border: `1px solid ${NAVY_SOFT}` }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
          Investigation Workspace
        </p>

        <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              Investigator Dashboard
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-white/80">
              Review assigned cases, save a draft, and submit findings for Manager review.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:shrink-0">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="min-w-[70px] rounded-xl px-3 py-2.5 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
              >
                <div className={`text-xl font-bold leading-6 ${kpi.alert ? 'text-amber-200' : 'text-white'}`}>
                  {kpi.value}
                </div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-wide text-white/75">
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Filter Toolbar ─────────────────────────────────────────────────── */}
      <section
        className="rounded-2xl p-4 shadow-sm"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2.5">
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, category, location…"
              className={filterClass}
              style={filterStyle}
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvestigationStatus | '')}
            className={`${filterClass} md:w-52 cursor-pointer`}
            style={filterStyle}
          >
            <option value="">All investigation states</option>
            <option value="DRAFT">Draft</option>
            <option value="REVISION_REQUESTED">Revision requested</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className={`${filterClass} md:w-44 cursor-pointer`}
            style={filterStyle}
          >
            <option value="">All severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={due}
            onChange={(e) => setDue(e.target.value as typeof due)}
            className={`${filterClass} md:w-44 cursor-pointer`}
            style={filterStyle}
          >
            <option value="">All due dates</option>
            <option value="OVERDUE">Overdue</option>
            <option value="NEXT_7_DAYS">Next 7 days</option>
            <option value="NO_DATE">No date set</option>
          </select>
        </div>
      </section>

      {/* ── Assigned Investigation Queue ───────────────────────────────────── */}
      <section
        className="overflow-hidden rounded-2xl shadow-sm"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        <div
          className="border-b px-5 py-4"
          style={{ borderColor: BORDER }}
        >
          <div>
            <h2 className="text-base font-bold tracking-tight" style={{ color: TEXT }}>
              Assigned Investigation Queue
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: MUTED }}>
              Cases currently assigned to you.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="text-sm font-bold" style={{ color: TEXT }}>
                No assigned incidents found
              </h3>
              <p className="text-[13px] mt-1 max-w-md mx-auto" style={{ color: MUTED }}>
                Adjust the filters above or await assignment from your Department Manager.
              </p>
            </div>
        ) : (
            <div className="divide-y divide-slate-200">
              {items.map((item) => {
                const inc = item.incident;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(`/investigator/${item.incidentId}`)}
                    aria-label={`Open investigation ${inc.id}: ${inc.title}`}
                    className="group flex w-full flex-col gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between"
                  >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded px-2 py-0.5 text-[11px] font-bold"
                            style={{ backgroundColor: '#F1F3F8', color: BODY, border: `1px solid ${BORDER}` }}
                          >
                            #{inc.id}
                          </span>
                          <span className="truncate text-sm font-bold transition-colors group-hover:text-[#2952C4]" style={{ color: TEXT }}>
                            {inc.title}
                          </span>
                          {getStatusPill(item.status)}
                          {item.overdue && (
                            <span className="inline-flex rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                              Overdue
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs" style={{ color: MUTED }}>
                          <span>{inc.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{inc.location}</span>
                          <span aria-hidden="true">·</span>
                          <span>{inc.department?.name ?? 'Department'}</span>
                        </div>

                        <div
                          className="mt-2 flex flex-wrap items-center text-[11px]"
                          style={{ color: MUTED, columnGap: '12px', rowGap: '4px' }}
                        >
                          {[
                            { label: 'Team', value: item._count.teamMembers },
                            { label: 'Factors', value: item._count.contributingFactors },
                            { label: 'Evidence', value: item._count.evidence },
                            { label: 'Timeline', value: item._count.timeline },
                          ].map((chip) => (
                            <span
                              key={chip.label}
                              className="inline-flex whitespace-nowrap"
                              style={{ columnGap: '4px' }}
                            >
                              <span>{chip.label}</span>
                              <span>{chip.value}</span>
                            </span>
                          ))}
                          <span className="inline-flex whitespace-nowrap" style={{ columnGap: '4px' }}>
                            <span>Revision</span>
                            <span>{item.revisionNumber}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-1 md:min-w-[110px] md:items-end md:self-stretch md:pt-0.5">
                        <span className="text-sm font-bold uppercase" style={{ color: getSeverityColor(inc.severity) }}>
                          {inc.severity}
                        </span>
                        <span className="text-xs" style={{ color: MUTED }}>
                          Target: {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Not scheduled'}
                        </span>
                      </div>
                  </button>
                );
              })}
            </div>
        )}
      </section>
    </div>
  );
};

export default InvestigatorDashboard;
