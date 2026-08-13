import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useIncident,
  useSubmitCorrectiveAction,
} from '../hooks/useIncidents';

// KAIROS Clinical Palette
const BG = '#090F16';
const PANEL = '#0E1720';
const TEXT = '#EEF7FC';
const TEAL = '#45A79A';
const ACCENT = '#4DC4B5';
const MUTED = '#8FA8B4';
const BORDER = '#253642';
const DANGER = '#EF4444';

const ActionOwnerIncidentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const incidentId = Number(id);

  const {
    data: incident,
    isLoading,
    isError,
    error,
  } = useIncident(incidentId);

  const submitCorrectiveAction = useSubmitCorrectiveAction();

  const [correctiveAction, setCorrectiveAction] = useState('');

  const handleSubmit = async () => {
    if (!incident) return;

    if (correctiveAction.trim().length < 20) {
      alert('Corrective action must be at least 20 characters long.');
      return;
    }

    try {
      await submitCorrectiveAction.mutateAsync({
        incidentId: incident.id,
        correctiveAction: correctiveAction.trim(),
      });

      alert('Corrective action submitted successfully.');

      navigate('/action-owner');
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Failed to submit corrective action.'
      );
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: TEAL }}
        />
      </div>
    );
  }

  // Error
  if (isError || !incident) {
    return (
      <div
        className="min-h-screen p-6"
        style={{ backgroundColor: BG }}
      >
        <div
          className="border-l-4 p-4 rounded-md max-w-3xl mx-auto"
          style={{
            backgroundColor: `${DANGER}15`,
            borderColor: DANGER,
          }}
        >
          <h3
            className="font-medium"
            style={{ color: DANGER }}
          >
            Error loading incident
          </h3>

          <p
            className="text-sm mt-1"
            style={{ color: MUTED }}
          >
            {error instanceof Error
              ? error.message
              : 'Incident not found.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: BG }}
    >
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <button
            onClick={() => navigate('/action-owner')}
            className="text-sm mb-4 hover:underline"
            style={{ color: ACCENT }}
          >
            ← Back to Action Owner Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p
                className="text-sm"
                style={{ color: MUTED }}
              >
                Incident #{incident.id}
              </p>

              <h1
                className="text-2xl font-bold mt-1"
                style={{ color: TEXT }}
              >
                {incident.title}
              </h1>
            </div>

            <span
              className="px-3 py-2 rounded-lg text-sm font-medium w-fit"
              style={{
                backgroundColor: `${TEAL}20`,
                color: ACCENT,
              }}
            >
              {incident.status}
            </span>
          </div>
        </div>

        {/* Incident Details */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <h2
            className="text-lg font-semibold mb-5"
            style={{ color: TEXT }}
          >
            Incident Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Severity
              </p>

              <p
                className="mt-1 text-sm"
                style={{ color: TEXT }}
              >
                {incident.severity}
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Category
              </p>

              <p
                className="mt-1 text-sm"
                style={{ color: TEXT }}
              >
                {incident.category}
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Location
              </p>

              <p
                className="mt-1 text-sm"
                style={{ color: TEXT }}
              >
                {incident.location}
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Reporter
              </p>

              <p
                className="mt-1 text-sm"
                style={{ color: TEXT }}
              >
                {incident.reporter?.name || 'Not available'}
              </p>
            </div>

          </div>

          {/* Description */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: BG,
              border: `1px solid ${BORDER}`,
            }}
          >
            <p
              className="text-sm font-medium mb-2"
              style={{ color: ACCENT }}
            >
              Incident Description
            </p>

            <p
              className="text-sm leading-6"
              style={{ color: MUTED }}
            >
              {incident.description}
            </p>
          </div>
        </div>

        {/* Investigator Findings */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <h2
            className="text-lg font-semibold mb-5"
            style={{ color: TEXT }}
          >
            Investigator Findings
          </h2>

          <div className="space-y-5">

            <div>
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: MUTED }}
              >
                Root Cause Category
              </p>

              <p
                className="mt-1 text-sm"
                style={{ color: TEXT }}
              >
                {incident.rootCauseCategory || 'Not provided'}
              </p>
            </div>

            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: BG,
                border: `1px solid ${BORDER}`,
              }}
            >
              <p
                className="text-sm font-medium mb-2"
                style={{ color: ACCENT }}
              >
                Root Cause Findings
              </p>

              <p
                className="text-sm leading-6"
                style={{ color: MUTED }}
              >
                {incident.rootCause || 'No investigator findings available.'}
              </p>
            </div>

            {incident.investigator && (
              <div>
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  Investigator
                </p>

                <p
                  className="mt-1 text-sm"
                  style={{ color: TEXT }}
                >
                  {incident.investigator.name}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Corrective Action */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: PANEL,
            border: `1px solid ${BORDER}`,
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: TEXT }}
          >
            Corrective Action
          </h2>

          <p
            className="text-sm mt-1 mb-4"
            style={{ color: MUTED }}
          >
            Describe the corrective action that will be taken to prevent
            this incident from happening again.
          </p>

          <textarea
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            placeholder="Enter corrective action details..."
            rows={7}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
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

          <div className="flex items-center justify-between mt-3">
            <p
              className="text-xs"
              style={{ color: MUTED }}
            >
              Minimum 20 characters
            </p>

            <p
              className="text-xs"
              style={{
                color:
                  correctiveAction.trim().length >= 20
                    ? ACCENT
                    : MUTED,
              }}
            >
              {correctiveAction.trim().length} characters
            </p>
          </div>

          <div className="flex gap-3 mt-5">

            <button
              onClick={handleSubmit}
              disabled={
                submitCorrectiveAction.isPending ||
                correctiveAction.trim().length < 20
              }
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
              style={{
                backgroundColor: ACCENT,
                color: BG,
              }}
            >
              {submitCorrectiveAction.isPending
                ? 'Submitting...'
                : 'Submit Corrective Action'}
            </button>

            <button
              onClick={() => navigate('/action-owner')}
              className="px-5 py-2.5 rounded-lg text-sm font-medium"
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

      </div>
    </div>
  );
};

export default ActionOwnerIncidentDetails;