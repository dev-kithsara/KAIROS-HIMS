// frontend/src/components/IncidentActions.tsx

import React from 'react';
import type { Incident } from '../types/incident';
import { useAuthContext } from '../context/AuthContext';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const TEAL   = '#45A79A';
const BLUE   = '#4588AB';
const ACCENT = '#4DC4B5';
const MUTED  = '#8FA8B4';
const BORDER = '#253642';
const DANGER = '#EF4444';
const AMBER  = '#FBBF24';
const VIOLET = '#C084FC';

interface IncidentActionsProps {
  incident: Incident;
  onAccept?: () => void;
  onReject?: () => void;
  onAssignInvestigator?: () => void;
  onAssignActionOwner?: () => void;
  onReview?: () => void;
  onClose?: () => void;
}

const ActionBtn: React.FC<{
  label: string;
  onClick?: () => void;
  bg: string;
  color?: string;
}> = ({ label, onClick, bg, color = '#EEF7FC' }) => (
  <button
    onClick={onClick}
    className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer"
    style={{ backgroundColor: bg, color, border: `1px solid ${bg}` }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
  >
    {label}
  </button>
);

export const IncidentActions: React.FC<IncidentActionsProps> = ({
  incident, onAccept, onReject, onAssignInvestigator,
  onAssignActionOwner, onReview, onClose,
}) => {
  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER';

  const renderButtons = () => {
    if (!isManager) {
      return (
        <p className="text-sm italic" style={{ color: MUTED }}>
          You do not have permission to perform workflow actions on this incident.
        </p>
      );
    }

    switch (incident.status) {
      case 'OPEN':
        return (
          <>
            <ActionBtn label="Accept Incident"  onClick={onAccept} bg={TEAL} />
            <ActionBtn label="Reject Incident"  onClick={onReject} bg={DANGER} />
          </>
        );
      case 'ACCEPTED':
        return <ActionBtn label="Assign Investigator" onClick={onAssignInvestigator} bg={BLUE} />;
      case 'INVESTIGATING':
        return <ActionBtn label="Assign Action Owner" onClick={onAssignActionOwner} bg={AMBER} color="#0E1720" />;
      case 'PENDING_ACTION':
        return <ActionBtn label="Mark as Under Review" onClick={onReview} bg={VIOLET} />;
      case 'UNDER_REVIEW':
        return <ActionBtn label="Close Incident" onClick={onClose} bg={ACCENT} color="#090F16" />;
      case 'CLOSED':
      case 'REJECTED':
        return (
          <p className="text-sm italic" style={{ color: MUTED }}>
            No further actions can be taken on this incident.
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-wrap gap-3 mt-6 pt-6"
      style={{ borderTop: `1px solid ${BORDER}` }}
    >
      {renderButtons()}
    </div>
  );
};

export default IncidentActions;