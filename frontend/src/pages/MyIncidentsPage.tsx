import React, { useMemo } from 'react';
import { Inbox } from 'lucide-react';
import { useMyIncidents } from '../hooks/useIncidents';

// ── KAIROS Blue Palette ───────────────────────────────────────────────────
const NAVY    = '#1E2B5E';
const ROYAL   = '#2952C4';
const SURFACE = '#F7F8FA';
const BG_PAGE = '#EDEEF3';
const BORDER  = '#D8DCE8';
const TEXT    = '#1A2447';
const MUTED   = '#6B7494';
const FAINT   = '#9BA4BC';
const GREEN   = '#16A34A';
const AMBER   = '#D97706';
const RED     = '#DC2626';

// Status badge colors, tuned for the light surface background
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  OPEN:            { bg: '#FEF2F2', text: RED,   border: '#FECACA' },
  ACCEPTED:        { bg: '#EBF0FA', text: ROYAL, border: '#C0CBE0' },
  REJECTED:        { bg: '#FEF2F2', text: RED,   border: '#FECACA' },
  INVESTIGATING:   { bg: '#FFFBEB', text: AMBER, border: '#FDE68A' },
  PENDING_ACTION:  { bg: '#FFFBEB', text: AMBER, border: '#FDE68A' },
  UNDER_REVIEW:    { bg: '#EBF0FA', text: ROYAL, border: '#C0CBE0' },
  CLOSED:          { bg: '#F0FDF4', text: GREEN, border: '#BBF7D0' },
};

const MyIncidentsPage: React.FC = () => {
  const { data: incidents, isLoading, isError, error } = useMyIncidents();

  // Work out the 4 stat numbers from the list we already fetched
  const stats = useMemo(() => {
    const total = incidents?.length ?? 0;
    const open = incidents?.filter((i) => i.status === 'OPEN').length ?? 0;
    const investigating = incidents?.filter((i) => i.status === 'INVESTIGATING').length ?? 0;
    const closed = incidents?.filter((i) => i.status === 'CLOSED').length ?? 0;
    return { total, open, investigating, closed };
  }, [incidents]);

  const statCards = [
    { label: 'Total Incidents', value: stats.total, color: ROYAL },
    { label: 'Open', value: stats.open, color: RED },
    { label: 'Investigating', value: stats.investigating, color: AMBER },
    { label: 'Closed', value: stats.closed, color: GREEN },
  ];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="space-y-5">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Page Header */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
        >
          <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
            My Incidents
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            View and track the incidents you have reported.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: FAINT }}>
                {stat.label}
              </p>
              <h2 className="mt-2 text-3xl font-bold" style={{ color: stat.color }}>
                {isLoading ? '—' : stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Incidents Section */}
        <div
          className="rounded-2xl"
          style={{ backgroundColor: SURFACE, border: `1.5px solid ${BORDER}`, boxShadow: '0 1px 6px rgba(17,17,132,0.06)' }}
        >
          <div className="p-6 border-b" style={{ borderColor: BORDER }}>
            <h2 className="text-base font-bold" style={{ color: TEXT }}>
              Reported Incidents
            </h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              Incidents submitted by you.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center p-16">
              <div
                className="animate-spin rounded-full h-11 w-11 border-[3px] border-t-transparent"
                style={{ borderColor: `${ROYAL} transparent ${ROYAL} ${ROYAL}` }}
              />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-6">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <h3 className="font-semibold" style={{ color: RED }}>Unable to load your incidents</h3>
                <p className="text-sm mt-1" style={{ color: '#EF4444' }}>
                  {error instanceof Error ? error.message : 'Please try again in a moment.'}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && (!incidents || incidents.length === 0) && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: '#EBF0FA', color: ROYAL }}
              >
                <Inbox className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-semibold" style={{ color: TEXT }}>
                No incidents found
              </h3>

              <p className="mt-2 max-w-md text-sm" style={{ color: MUTED }}>
                You have not reported any incidents yet. Once you submit an
                incident, it will appear here.
              </p>
            </div>
          )}

          {/* Incident List */}
          {!isLoading && !isError && incidents && incidents.length > 0 && (
            <div className="p-6 space-y-4">
              {incidents.map((incident) => {
                const status = STATUS_COLORS[incident.status] ?? {
                  bg: BG_PAGE,
                  text: MUTED,
                  border: BORDER,
                };

                return (
                  <div
                    key={incident.id}
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: BG_PAGE, border: `1px solid ${BORDER}` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold" style={{ color: TEXT }}>
                        {incident.title}
                      </h3>
                      <span
                        className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0"
                        style={{ backgroundColor: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                      >
                        {incident.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-sm mt-2 leading-relaxed" style={{ color: MUTED }}>
                      {incident.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs mt-3" style={{ color: FAINT }}>
                      <span>{incident.department?.name ?? 'Unknown department'}</span>
                      <span>•</span>
                      <span>{incident.severity}</span>
                      <span>•</span>
                      <span>{formatDate(incident.createdAt)}</span>
                    </div>

                    {incident.status === 'REJECTED' && incident.rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                        <p className="text-xs font-semibold" style={{ color: RED }}>
                          Rejection reason: {incident.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyIncidentsPage;