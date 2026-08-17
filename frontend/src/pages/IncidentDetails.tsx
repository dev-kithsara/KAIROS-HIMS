// frontend/src/pages/IncidentDetails.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useDepartmentIncidents,
  useAcceptIncident,
  useReviewIncident,
  useCloseIncident,
  useRejectIncident,
  useAssignInvestigator,
  useAssignActionOwner,
} from '../hooks/useIncidents';

import { IncidentActions } from '../components/IncidentActions';
import { RejectModal } from '../components/RejectModal';
import { AssignUserModal } from '../components/AssignUserModal';
import { useAuthContext } from '../context/AuthContext';
import { useUsersByRole } from '../hooks/useIncidents';

// ── KAIROS Clinical Palette ────────────────────────────────────────────────
const BG     = '#090F16';
const PANEL  = '#0E1720';
const TEXT   = '#EEF7FC';
const MUTED  = '#8FA8B4';
const BORDER = '#253642';
const TEAL   = '#45A79A';
const BLUE   = '#4588AB';
const ACCENT = '#4DC4B5';

// Status badge styles
const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  OPEN:           { bg: '#38BDF822', color: '#38BDF8' },
  ACCEPTED:       { bg: '#2DD4BF22', color: '#2DD4BF' },
  REJECTED:       { bg: '#F8717122', color: '#F87171' },
  INVESTIGATING:  { bg: '#60A5FA22', color: '#60A5FA' },
  PENDING_ACTION: { bg: '#FBBF2422', color: '#FBBF24' },
  IN_PROGRESS:    { bg: '#C084FC22', color: '#C084FC' },
  UNDER_REVIEW:   { bg: '#FDE04722', color: '#FDE047' },
  CLOSED:         { bg: '#4ADE8022', color: '#4ADE80' },
};

export const IncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const departmentId = user?.departmentId ?? 1;

  const { data: incidents, isLoading } = useDepartmentIncidents(departmentId);
  const incident = incidents?.find(inc => inc.id === Number(id));

  const acceptMutation             = useAcceptIncident();
  const reviewMutation             = useReviewIncident();
  const closeMutation              = useCloseIncident();
  const rejectMutation             = useRejectIncident();
  const assignInvestigatorMutation = useAssignInvestigator();
  const assignActionOwnerMutation  = useAssignActionOwner();

  const { data: investigators = [] } = useUsersByRole('INVESTIGATOR');
  const { data: actionOwners = [] }  = useUsersByRole('ACTION_OWNER');

  const [isRejectModalOpen,       setIsRejectModalOpen]       = useState(false);
  const [isInvestigatorModalOpen, setIsInvestigatorModalOpen] = useState(false);
  const [isActionOwnerModalOpen,  setIsActionOwnerModalOpen]  = useState(false);

  const handleAccept = () => {
    if (window.confirm('Are you sure you want to accept this incident?')) {
      acceptMutation.mutate(Number(id));
    }
  };
  const handleReview = () => {
    if (window.confirm('Mark this incident as under review?')) {
      reviewMutation.mutate(Number(id));
    }
  };
  const handleClose = () => {
    if (window.confirm('Are you sure you want to close this incident? This action cannot be undone.')) {
      closeMutation.mutate(Number(id));
    }
  };
  const handleConfirmReject = (reason: string) => {
    rejectMutation.mutate({ id: Number(id), reason }, { onSuccess: () => setIsRejectModalOpen(false) });
  };
  const handleConfirmInvestigator = (userId: number) => {
    assignInvestigatorMutation.mutate({ id: Number(id), investigatorId: userId }, { onSuccess: () => setIsInvestigatorModalOpen(false) });
  };
  const handleConfirmActionOwner = (userId: number) => {
    assignActionOwnerMutation.mutate({ id: Number(id), actionOwnerId: userId }, { onSuccess: () => setIsActionOwnerModalOpen(false) });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm" style={{ color: MUTED }}>Loading details...</div>;
  }

  if (!incident) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F87171' }}>Incident not found</h2>
        <button onClick={() => navigate('/')} className="text-sm font-medium hover:underline" style={{ color: ACCENT }}>
          &larr; Go back to Dashboard
        </button>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[incident.status] ?? { bg: BORDER, color: MUTED };

  return (
    <div className="min-h-screen p-2 sm:p-4" style={{ backgroundColor: BG, color: TEXT }}>
      <div
        className="max-w-4xl mx-auto rounded-xl p-6"
        style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}` }}
      >
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-sm font-medium flex items-center hover:underline cursor-pointer"
          style={{ color: ACCENT }}
        >
          &larr; Back to Dashboard
        </button>

        {/* Header */}
        <div className="pb-5 mb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex justify-between items-start flex-wrap gap-3">
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>{incident.title}</h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.color}40` }}
            >
              {incident.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm mt-2" style={{ color: MUTED }}>
            Reported on: {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-2" style={{ color: TEXT }}>Description</h3>
          <p
            className="text-sm p-4 rounded-lg whitespace-pre-wrap leading-relaxed"
            style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: MUTED }}
          >
            {incident.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Severity',   value: incident.severity },
            { label: 'Category',   value: incident.category },
            { label: 'Location',   value: incident.location },
            { label: 'Department', value: incident.department?.name || 'Not Available' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="p-4 rounded-lg"
              style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
            >
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: MUTED }}>{label}</h4>
              <p className="font-semibold text-sm" style={{ color: TEXT }}>{value}</p>
            </div>
          ))}
        </div>

        {/* People Involved */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${BLUE}18`, border: `1px solid ${BLUE}44` }}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: BLUE }}>Reporter</h4>
            <p className="font-semibold text-sm" style={{ color: TEXT }}>{incident.reporter?.name || 'Unknown'}</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${TEAL}18`, border: `1px solid ${TEAL}44` }}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: TEAL }}>Investigator</h4>
            <p className="font-semibold text-sm" style={{ color: TEXT }}>{incident.investigator?.name || 'Not assigned'}</p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: ACCENT }}>Action Owner</h4>
            <p className="font-semibold text-sm" style={{ color: TEXT }}>{incident.actionOwner?.name || 'Not assigned'}</p>
          </div>
        </div>

        {/* Root Cause */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3" style={{ color: TEXT }}>Root Cause Analysis</h3>
          <div className="p-4 rounded-lg" style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}>
            <p className="text-sm mb-2" style={{ color: MUTED }}>
              <span className="font-semibold" style={{ color: TEXT }}>Category: </span>
              {incident.rootCauseCategory || 'Not submitted'}
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>Root Cause:</p>
            <p className="text-sm" style={{ color: MUTED }}>
              {incident.rootCause || 'No root cause analysis submitted yet.'}
            </p>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3" style={{ color: TEXT }}>Attachments</h3>
          <div className="p-4 rounded-lg" style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}>
            {incident.attachments && incident.attachments.length > 0 ? (
              <ul className="space-y-2">
                {incident.attachments.map((file) => (
                  <li
                    key={file.id}
                    className="flex justify-between items-center text-sm pb-2"
                    style={{ borderBottom: `1px solid ${BORDER}`, color: TEXT }}
                  >
                    <span>{file.fileName}</span>
                    <button className="font-medium hover:underline text-xs" style={{ color: ACCENT }}>View</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm" style={{ color: MUTED }}>No attachments uploaded.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <IncidentActions
          incident={incident}
          onAccept={handleAccept}
          onReview={handleReview}
          onClose={handleClose}
          onReject={() => setIsRejectModalOpen(true)}
          onAssignInvestigator={() => setIsInvestigatorModalOpen(true)}
          onAssignActionOwner={() => setIsActionOwnerModalOpen(true)}
        />

        {(acceptMutation.isPending || reviewMutation.isPending || closeMutation.isPending) && (
          <div className="mt-4 text-sm font-medium animate-pulse" style={{ color: ACCENT }}>
            Processing action, please wait...
          </div>
        )}
      </div>

      {/* Modals */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        isLoading={rejectMutation.isPending}
      />
      <AssignUserModal
        isOpen={isInvestigatorModalOpen}
        onClose={() => setIsInvestigatorModalOpen(false)}
        onConfirm={handleConfirmInvestigator}
        isLoading={assignInvestigatorMutation.isPending}
        title="Assign Investigator"
        description="Select an investigator to find the root cause of this incident."
        availableUsers={investigators}
      />
      <AssignUserModal
        isOpen={isActionOwnerModalOpen}
        onClose={() => setIsActionOwnerModalOpen(false)}
        onConfirm={handleConfirmActionOwner}
        isLoading={assignActionOwnerMutation.isPending}
        title="Assign Action Owner"
        description="Select an action owner to implement corrective actions."
        availableUsers={actionOwners}
      />
    </div>
  );
};