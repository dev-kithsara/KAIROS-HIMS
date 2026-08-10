// frontend/src/components/IncidentCard.tsx

import React from 'react';
import type { Incident } from '../types/incident';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const PANEL   = '#0E1720';
const TEXT    = '#EEF7FC';
const MUTED   = '#8FA8B4';
const BORDER  = '#253642';
const ACCENT  = '#4DC4B5';

// Status hex values
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  OPEN:           { bg: '#38BDF822', text: '#38BDF8' },
  ACCEPTED:       { bg: '#2DD4BF22', text: '#2DD4BF' },
  REJECTED:       { bg: '#F8717122', text: '#F87171' },
  INVESTIGATING:  { bg: '#60A5FA22', text: '#60A5FA' },
  PENDING_ACTION: { bg: '#FBBF2422', text: '#FBBF24' },
  IN_PROGRESS:    { bg: '#C084FC22', text: '#C084FC' },
  UNDER_REVIEW:   { bg: '#FDE04722', text: '#FDE047' },
  CLOSED:         { bg: '#4ADE8022', text: '#4ADE80' },
};

// Severity top bar & badge colors
const SEVERITY_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  LOW:      { bar: '#22C55E', bg: '#22C55E22', text: '#22C55E' },
  MEDIUM:   { bar: '#EAB308', bg: '#EAB30822', text: '#EAB308' },
  HIGH:     { bar: '#F97316', bg: '#F9731622', text: '#F97316' },
  CRITICAL: { bar: '#EF4444', bg: '#EF444422', text: '#EF4444' },
};

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  const status   = STATUS_COLORS[incident.status]   ?? { bg: '#25364222', text: '#8FA8B4' };
  const severity = SEVERITY_COLORS[incident.severity] ?? { bar: '#253642', bg: '#25364222', text: '#8FA8B4' };

  const formattedDate = new Date(incident.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="group rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
      style={{
        backgroundColor: PANEL,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#45A79A';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(69,167,154,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = BORDER;
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      }}
    >
      {/* Severity top bar */}
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: severity.bar }} />

      <div className="p-5 pt-6">
        {/* Title + Status Badge */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3
            className="text-base font-bold truncate transition-colors"
            style={{ color: TEXT }}
          >
            {incident.title}
          </h3>
          <span
            className="px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0"
            style={{ backgroundColor: status.bg, color: status.text, border: `1px solid ${status.text}40` }}
          >
            {incident.status.replace(/_/g, ' ')}
          </span>
        </div>

        <p className="text-sm line-clamp-2 mb-4" style={{ color: MUTED }}>
          {incident.description}
        </p>
      </div>

      {/* Footer row */}
      <div
        className="flex justify-between items-center px-5 py-3 text-xs"
        style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}
      >
        <div className="flex items-center gap-2">
          <span>Reporter:</span>
          <span className="font-semibold" style={{ color: ACCENT }}>
            {incident.reporter?.name || 'Unknown'}
          </span>
          {/* Severity Badge */}
          <span
            className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide"
            style={{ backgroundColor: severity.bg, color: severity.text, border: `1px solid ${severity.text}40` }}
          >
            {incident.severity}
          </span>
        </div>
        <div className="font-medium">{formattedDate}</div>
      </div>
    </div>
  );
};
