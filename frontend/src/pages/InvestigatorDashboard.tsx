import { useMemo } from "react";
import { IncidentCard } from '../components/IncidentCard';
import { useAssignedIncidents } from '../hooks/useIncidents';
import { useNavigate } from 'react-router-dom';
import type { Incident } from "../types/incident";

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
      <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
            <p className="text-sm font-medium">Loading assigned incidents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-rose-700">Unable to load incidents</h2>
          <p className="mt-3 text-sm text-rose-600">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Investigator workspace
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Investigator Dashboard</h1>
          <p className="mt-3 text-slate-500">No assigned incidents found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B4F8A] via-[#1473B8] to-[#38A0D8] text-white shadow-lg">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100">
                Investigator workspace
              </span>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Assigned Incidents</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
                Review and resolve the incidents currently assigned to you in one focused queue.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Total</p>
                <p className="mt-1 text-2xl font-bold">{stats.count}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Active</p>
                <p className="mt-1 text-2xl font-bold">{stats.activeCount}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Review</p>
                <p className="mt-1 text-2xl font-bold">{stats.reviewCount}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Incident Queue</h2>
              <p className="text-sm text-slate-500">Click any incident to view the full investigation details.</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-all duration-200 hover:border-blue-200 hover:shadow-md">
                <IncidentCard
                    incident={incident}
                    onClick={() => handleIncidentClick(incident)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InvestigatorDashboard;