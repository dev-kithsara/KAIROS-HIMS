import { useMemo } from "react";
import { IncidentCard } from '../components/IncidentCard';
import { useAssignedIncidents } from '../hooks/useIncidents';
import { useNavigate } from 'react-router-dom';
import type { Incident } from "../types/incident";
import { Inbox } from 'lucide-react';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG = '#090F16';
const PANEL = '#0E1720';
const TEXT = '#EEF7FC';
const TEAL = '#45A79A';
const ACCENT = '#4DC4B5';
const MUTED = '#8FA8B4';
const BORDER = '#253642';
const DANGER = '#EF4444';

const InvestigatorDashboard = () => {
  const navigate = useNavigate();
  const {
    data: incidents,
    isLoading,
    isError,
    error,
  } = useAssignedIncidents();

  const stats = useMemo(() => {
    const count = incidents?.length ?? 0;
    const activeCount = incidents?.filter((incident) =>
      ['OPEN', 'ACCEPTED', 'INVESTIGATING', 'PENDING_ACTION'].includes(incident.status)
    ).length ?? 0;
    const reviewCount = incidents?.filter((incident) =>
      ['UNDER_REVIEW', 'CLOSED'].includes(incident.status)
    ).length ?? 0;

    return { count, activeCount, reviewCount };
  }, [incidents]);

  const handleIncidentClick = (incident: Incident) => {
    navigate(`/investigator/${incident.id}`, {
      state: { incident },
    });
  };

  if (isLoading) {
    return (
      <div
        className="min-h-[50vh] flex items-center justify-center"
        style={{ backgroundColor: BG }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
            style={{ borderColor: `${TEAL} transparent ${TEAL} ${TEAL}` }}
          />
          <p className="text-sm" style={{ color: MUTED }}>
            Loading assigned incidents...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="p-6 rounded-xl border-l-4"
        style={{
          backgroundColor: PANEL,
          borderLeftColor: DANGER,
          borderTop: `1px solid ${BORDER}`,
          borderRight: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <h3 className="font-semibold" style={{ color: DANGER }}>
          Error loading incidents
        </h3>
        <p className="text-sm mt-2" style={{ color: MUTED }}>
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="space-y-6">
        <div
          className="p-6 rounded-xl border"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
            Investigator Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Review and resolve the incidents assigned to you.
          </p>
        </div>

        <div
          className="flex flex-col items-center justify-center p-12 text-center rounded-xl border"
          style={{ backgroundColor: PANEL, borderColor: BORDER }}
        >
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${TEAL}1A`, color: TEAL }}
          >
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: TEXT }}>
            No assigned incidents found
          </h3>
          <p className="mt-2 max-w-md text-sm" style={{ color: MUTED }}>
            Incidents assigned to you by a manager will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-xl border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
            Assigned Incidents
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Review and resolve the incidents currently assigned to you in one focused queue.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div
            className="rounded-lg px-4 py-3"
            style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Total
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: TEXT }}>
              {stats.count}
            </p>
          </div>
          <div
            className="rounded-lg px-4 py-3"
            style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Active
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: ACCENT }}>
              {stats.activeCount}
            </p>
          </div>
          <div
            className="rounded-lg px-4 py-3"
            style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
              Review
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: TEAL }}>
              {stats.reviewCount}
            </p>
          </div>
        </div>
      </div>

      {/* Incident Queue */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <div className="mb-5">
          <h2 className="text-lg font-semibold" style={{ color: TEXT }}>
            Incident Queue
          </h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Click any incident to view the full investigation details.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={() => handleIncidentClick(incident)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestigatorDashboard;