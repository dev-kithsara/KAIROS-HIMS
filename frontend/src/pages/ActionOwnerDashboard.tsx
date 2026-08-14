import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useActionOwnerIncidents, useSubmitCorrectiveAction, } from '../hooks/useIncidents';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG = '#090F16';
const PANEL = '#0E1720';
const TEXT = '#EEF7FC';
const TEAL = '#45A79A';
const ACCENT = '#4DC4B5';
const MUTED = '#8FA8B4';
const BORDER = '#253642';
const DANGER = '#EF4444';
const WARNING = '#F59E0B';

export const ActionOwnerDashboard: React.FC = () => {
    const navigate = useNavigate();
  const {
    data: incidents,
    isLoading,
    isError,
    error,
  } = useActionOwnerIncidents();
  
  const submitCorrectiveAction = useSubmitCorrectiveAction();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(
    null
  );
  const [correctiveAction, setCorrectiveAction] = useState('');

  // ── Filter incidents ───────────────────────────────────────────────────
  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];

    const searchLower = searchTerm.toLowerCase().trim();

    if (!searchLower) {
      return incidents;
    }

    return incidents.filter((incident) => {
      return (
        incident.title.toLowerCase().includes(searchLower) ||
        incident.category.toLowerCase().includes(searchLower) ||
        incident.severity.toLowerCase().includes(searchLower) ||
        incident.location.toLowerCase().includes(searchLower)
      );
    });
  }, [incidents, searchTerm]);

  // ── Submit corrective action ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedIncidentId) return;

    if (correctiveAction.trim().length < 20) {
      alert('Corrective action must be at least 20 characters long.');
      return;
    }

    try {
      await submitCorrectiveAction.mutateAsync({
        incidentId: selectedIncidentId,
        correctiveAction: correctiveAction.trim(),
      });

      setCorrectiveAction('');
      setSelectedIncidentId(null);

      alert('Corrective action submitted successfully.');
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to submit corrective action.'
      );
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
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

  // ── Error ──────────────────────────────────────────────────────────────
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
          {error instanceof Error
            ? error.message
            : 'Unknown error occurred.'}
        </p>
      </div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen p-6 space-y-6"
      style={{ backgroundColor: BG }}
    >
      {/* Header + Search */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-xl"
        style={{
          backgroundColor: PANEL,
          border: `1px solid ${BORDER}`,
        }}
      >
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: TEXT }}
          >
            Action Owner Dashboard
          </h1>

          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Review assigned incidents and submit corrective actions.
          </p>
        </div>

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
          onFocus={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = BORDER;
          }}
        />
      </div>

      {/* Summary */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <p className="text-sm" style={{ color: MUTED }}>
            Assigned Incidents
          </p>

          <p
            className="text-3xl font-bold mt-2"
            style={{ color: TEXT }}
          >
            {incidents?.length ?? 0}
          </p>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <p className="text-sm" style={{ color: MUTED }}>
            Pending Actions
          </p>

          <p
            className="text-3xl font-bold mt-2"
            style={{ color: ACCENT }}
          >
            {incidents?.filter(
              (incident) => incident.status === 'PENDING_ACTION'
            ).length ?? 0}
          </p>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <p className="text-sm" style={{ color: MUTED }}>
            Search Results
          </p>

          <p
            className="text-3xl font-bold mt-2"
            style={{ color: TEAL }}
          >
            {filteredIncidents.length}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {filteredIncidents.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center flex flex-col items-center justify-center min-h-[300px]"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: BG }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: MUTED }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>

          <h3
            className="text-lg font-semibold"
            style={{ color: TEXT }}
          >
            No pending actions
          </h3>

          <p
            className="text-sm mt-1 max-w-sm"
            style={{ color: MUTED }}
          >
            {searchTerm
              ? 'No incidents match your search.'
              : 'There are currently no incidents assigned to you.'}
          </p>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-sm font-medium hover:underline"
              style={{ color: ACCENT }}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        /* Incident Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => navigate(`/action-owner/incidents/${incident.id}`)}
              className="rounded-xl p-5 transition-all duration-200"
              style={{
                backgroundColor: PANEL,
                border: `1px solid ${BORDER}`,
              }}
            >
              {/* Incident Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: TEXT }}
                  >
                    {incident.title}
                  </h2>

                  <p
                    className="text-xs mt-1"
                    style={{ color: MUTED }}
                  >
                    Incident #{incident.id}
                  </p>
                </div>

                <span
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: `${TEAL}20`,
                    color: ACCENT,
                  }}
                >
                  {incident.status}
                </span>
              </div>

              {/* Incident Information */}
              <div className="mt-4 space-y-2 text-sm">
                <p style={{ color: MUTED }}>
                  <span style={{ color: TEXT }}>Severity:</span>{' '}
                  {incident.severity}
                </p>

                <p style={{ color: MUTED }}>
                  <span style={{ color: TEXT }}>Category:</span>{' '}
                  {incident.category}
                </p>

                <p style={{ color: MUTED }}>
                  <span style={{ color: TEXT }}>Location:</span>{' '}
                  {incident.location}
                </p>

                {incident.investigator && (
                  <p style={{ color: MUTED }}>
                    <span style={{ color: TEXT }}>Investigator:</span>{' '}
                    {incident.investigator.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div
                className="mt-4 p-3 rounded-lg"
                style={{
                  backgroundColor: BG,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: ACCENT }}
                >
                  Incident Description
                </p>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: MUTED }}
                >
                  {incident.description}
                </p>
              </div>

              {/* Corrective Action Form */}
              {selectedIncidentId === incident.id ? (
                <div className="mt-4">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: TEXT }}
                  >
                    Corrective Action
                  </label>

                  <textarea
                    value={correctiveAction}
                    onChange={(e) =>
                      setCorrectiveAction(e.target.value)
                    }
                    placeholder="Describe the corrective action that will be taken..."
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none transition-all"
                    style={{
                      backgroundColor: BG,
                      border: `1px solid ${BORDER}`,
                      color: TEXT,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = ACCENT;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  />

                  <div className="flex justify-between mt-2">
                    <span
                      className="text-xs"
                      style={{
                        color:
                          correctiveAction.trim().length < 20
                            ? WARNING
                            : TEAL,
                      }}
                    >
                      {correctiveAction.trim().length}/20 minimum characters
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={submitCorrectiveAction.isPending}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: ACCENT,
                        color: BG,
                      }}
                    >
                      {submitCorrectiveAction.isPending
                        ? 'Submitting...'
                        : 'Submit Action'}
                    </button>

                    {/* Cancel */}
                    <button
                      onClick={() => {
                        setSelectedIncidentId(null);
                        setCorrectiveAction('');
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: BG,
                        color: MUTED,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Submit Button */
                <button
                  onClick={() => {
                    setSelectedIncidentId(incident.id);
                    setCorrectiveAction('');
                  }}
                  className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: ACCENT,
                    color: BG,
                  }}
                >
                  Submit Corrective Action
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionOwnerDashboard;