// frontend/src/pages/ManagerDashboard.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartmentIncidents } from '../hooks/useIncidents';
import { IncidentCard } from '../components/IncidentCard';
import { useAuthContext } from '../context/AuthContext';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG     = '#090F16';
const PANEL  = '#0E1720';
const TEXT   = '#EEF7FC';
const TEAL   = '#45A79A';
const ACCENT = '#4DC4B5';
const MUTED  = '#8FA8B4';
const BORDER = '#253642';
const DANGER = '#EF4444';

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const departmentId = user?.departmentId ?? 1;
  const { data: incidents, isLoading, isError, error } = useDepartmentIncidents(departmentId);

  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];
    return incidents.filter((incident) => {
      const matchesStatus =
        statusFilter === 'ALL' || incident.status === statusFilter;
      const searchLower  = searchTerm.toLowerCase();
      const matchesSearch =
        incident.title.toLowerCase().includes(searchLower) ||
        (incident.reporter?.name || '').toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [incidents, searchTerm, statusFilter]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: TEAL }}
        />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div
        className="border-l-4 p-4 rounded-md"
        style={{ backgroundColor: `${DANGER}15`, borderColor: DANGER }}
      >
        <h3 className="font-medium" style={{ color: DANGER }}>Error loading incidents</h3>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header + Filters */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-xl"
        style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}` }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: TEXT }}>
            Manager Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Manage and track incidents in your department.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg w-full sm:w-60 outline-none transition-all"
            style={{
              backgroundColor: BG,
              border: `1px solid ${BORDER}`,
              color: TEXT,
            }}
            onFocus={(e) => { (e.target as HTMLElement).style.borderColor = ACCENT; }}
            onBlur={(e)  => { (e.target as HTMLElement).style.borderColor = BORDER; }}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg cursor-pointer outline-none transition-all"
            style={{
              backgroundColor: BG,
              border: `1px solid ${BORDER}`,
              color: TEXT,
            }}
          >
            {[
              ['ALL',            'All Statuses'],
              ['OPEN',           'Open'],
              ['ACCEPTED',       'Accepted'],
              ['INVESTIGATING',  'Investigating'],
              ['PENDING_ACTION', 'Pending Action'],
              ['UNDER_REVIEW',   'Under Review'],
              ['CLOSED',         'Closed'],
              ['REJECTED',       'Rejected'],
            ].map(([value, label]) => (
              <option key={value} value={value} style={{ backgroundColor: PANEL }}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid / Empty State */}
      {filteredIncidents.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center flex flex-col items-center justify-center min-h-[300px]"
          style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}` }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: BG }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: MUTED }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold" style={{ color: TEXT }}>No incidents found</h3>
          <p className="text-sm mt-1 max-w-sm" style={{ color: MUTED }}>
            {searchTerm || statusFilter !== 'ALL'
              ? "We couldn't find any incidents matching your current filters."
              : 'There are currently no incidents reported in your department.'}
          </p>
          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
              className="mt-4 text-sm font-medium hover:underline"
              style={{ color: ACCENT }}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={() => navigate(`/incidents/${incident.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
