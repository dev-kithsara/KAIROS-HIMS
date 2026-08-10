// frontend/src/pages/IncidentDetails.tsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Custom Hooks for API Mutations ---
// These hooks encapsulate React Query logic for clean component code
import { 
  useDepartmentIncidents, 
  useAcceptIncident, 
  useReviewIncident, 
  useCloseIncident,
  useRejectIncident,
  useAssignInvestigator,
  useAssignActionOwner 
} from '../hooks/useIncidents';

// --- UI Components ---
import { IncidentActions } from '../components/IncidentActions';
import { RejectModal } from '../components/RejectModal';
import { AssignUserModal } from '../components/AssignUserModal'; 
import { useAuthContext } from '../context/AuthContext';

// --- Mock Data ---
// TODO: Replace these with actual API calls (e.g., useUsersByRole hook) in the future
const MOCK_INVESTIGATORS = [{ id: 2, name: 'Nimal Investigator', role: 'INVESTIGATOR' }];
const MOCK_ACTION_OWNERS = [{ id: 6, name: 'Sunil Action Owner', role: 'ACTION_OWNER' }];

export const IncidentDetails: React.FC = () => {
  // 1. ROUTING & PARAMS
  // Extract the incident ID from the URL (e.g., /incidents/123)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  // Read departmentId from the logged-in user's context.
  const departmentId = user?.departmentId ?? 1;
  
  // 2. DATA FETCHING
  // Fetch the cached list of incidents and find the specific one by ID.
  // We use Number(id) because URL params are always strings.
  const { data: incidents, isLoading } = useDepartmentIncidents(departmentId);
  const incident = incidents?.find(inc => inc.id === Number(id));

  // 3. MUTATION HOOKS INITIALIZATION
  // These hooks provide the .mutate() function to trigger backend API calls
  const acceptMutation = useAcceptIncident();
  const reviewMutation = useReviewIncident();
  const closeMutation = useCloseIncident();
  const rejectMutation = useRejectIncident();
  const assignInvestigatorMutation = useAssignInvestigator();
  const assignActionOwnerMutation = useAssignActionOwner();
  
  // 4. MODAL VISIBILITY STATES
  // Used to toggle the display of popup modals for actions requiring extra input
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isInvestigatorModalOpen, setIsInvestigatorModalOpen] = useState(false);
  const [isActionOwnerModalOpen, setIsActionOwnerModalOpen] = useState(false);

  // ---------------------------------------------------------
  // 5. ACTION HANDLERS (Direct Actions)
  // These actions only require a simple confirmation before executing
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  // 6. MODAL CONFIRMATION HANDLERS
  // These are triggered when the user clicks "Confirm" inside a modal
  // ---------------------------------------------------------

  const handleConfirmReject = (reason: string) => {
    rejectMutation.mutate(
      { id: Number(id), reason },
      {
        // Automatically close the modal only if the API call succeeds
        onSuccess: () => setIsRejectModalOpen(false) 
      }
    );
  };

  const handleConfirmInvestigator = (userId: number) => {
    assignInvestigatorMutation.mutate(
      { id: Number(id), investigatorId: userId },
      { onSuccess: () => setIsInvestigatorModalOpen(false) }
    );
  };

  const handleConfirmActionOwner = (userId: number) => {
    assignActionOwnerMutation.mutate(
      { id: Number(id), actionOwnerId: userId },
      { onSuccess: () => setIsActionOwnerModalOpen(false) }
    );
  };

  // ---------------------------------------------------------
  // 7. EARLY RETURNS (Loading & Error States)
  // ---------------------------------------------------------

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  }

  if (!incident) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <h2 className="text-xl text-red-600 font-semibold mb-4">Incident not found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
          &larr; Go back to Dashboard
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 8. MAIN UI RENDER
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F1F5F9] p-2 sm:p-4">
      <div className="max-w-4xl mx-auto bg-[#111827] rounded-xl shadow-xl border border-[#1E293B] p-6">
        {/* Navigation: Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-sm text-[#22D3EE] hover:underline flex items-center font-medium cursor-pointer"
        >
          &larr; Back to Dashboard
        </button>

        {/* Header Section: Title and Current Status */}
        <div className="border-b border-[#1E293B] pb-4 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-[#F1F5F9]">{incident.title}</h1>
            <span className="px-3 py-1 bg-[#1E293B] text-[#22D3EE] border border-[#1E293B] rounded-full text-xs font-bold tracking-wider">
              {incident.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[#94A3B8] text-sm mt-2">
            Reported on: {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">Description</h3>
          <p className="text-[#F1F5F9] bg-[#1E293B]/40 p-4 rounded-lg border border-[#1E293B] whitespace-pre-wrap text-sm leading-relaxed">
            {incident.description}
          </p>
        </div>

        {/* Incident Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1E293B]/40 p-4 rounded-lg border border-[#1E293B]">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
              Severity
            </h4>
            <p className="font-semibold text-[#F1F5F9]">{incident.severity}</p>
          </div>

          <div className="bg-[#1E293B]/40 p-4 rounded-lg border border-[#1E293B]">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
              Category
            </h4>
            <p className="font-semibold text-[#F1F5F9]">{incident.category}</p>
          </div>

          <div className="bg-[#1E293B]/40 p-4 rounded-lg border border-[#1E293B]">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
              Location
            </h4>
            <p className="font-semibold text-[#F1F5F9]">{incident.location}</p>
          </div>

          <div className="bg-[#1E293B]/40 p-4 rounded-lg border border-[#1E293B]">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-1">
              Department
            </h4>
            <p className="font-semibold text-[#F1F5F9]">
              {incident.department?.name || 'Not Available'}
            </p>
          </div>
        </div>

        {/* People Involved Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#3B82F6]/10 p-4 rounded-lg border border-[#3B82F6]/30">
            <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-1">
              Reporter
            </h4>
            <p className="text-[#F1F5F9] font-semibold">{incident.reporter?.name || 'Unknown'}</p>
          </div>
          <div className="bg-[#F59E0B]/10 p-4 rounded-lg border border-[#F59E0B]/30">
            <h4 className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-1">
              Investigator
            </h4>
            <p className="text-[#F1F5F9] font-semibold">
              {incident.investigator?.name || 'Not assigned'}
            </p>
          </div>
          <div className="bg-[#0D9488]/10 p-4 rounded-lg border border-[#0D9488]/30">
            <h4 className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-1">
              Action Owner
            </h4>
            <p className="text-[#F1F5F9] font-semibold">
              {incident.actionOwner?.name || 'Not assigned'}
            </p>
          </div>
        </div>

        {/* Root Cause Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Root Cause Analysis</h3>

          <div className="bg-[#1E293B]/40 rounded-lg border border-[#1E293B] p-4">
            <p className="text-sm text-[#94A3B8]">
              <strong className="text-[#F1F5F9]">Category:</strong>{' '}
              {incident.rootCauseCategory || 'Not submitted'}
            </p>

            <p className="mt-3 text-sm font-semibold text-[#F1F5F9]">Root Cause:</p>

            <p className="text-[#94A3B8] text-sm mt-1">
              {incident.rootCause || 'No root cause analysis submitted yet.'}
            </p>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#F1F5F9] mb-3">Attachments</h3>

          <div className="bg-[#1E293B]/40 border border-[#1E293B] rounded-lg p-4">
            {incident.attachments && incident.attachments.length > 0 ? (
              <ul className="space-y-2">
                {incident.attachments.map((file) => (
                  <li
                    key={file.id}
                    className="flex justify-between items-center border-b border-[#1E293B] pb-2 text-sm text-[#F1F5F9]"
                  >
                    <span>{file.fileName}</span>
                    <button className="text-[#22D3EE] hover:underline font-medium">View</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#94A3B8] text-sm">No attachments uploaded.</p>
            )}
          </div>
        </div>

        {/* Action Buttons Component */}
        <IncidentActions
          incident={incident}
          onAccept={handleAccept}
          onReview={handleReview}
          onClose={handleClose}
          onReject={() => setIsRejectModalOpen(true)}
          onAssignInvestigator={() => setIsInvestigatorModalOpen(true)}
          onAssignActionOwner={() => setIsActionOwnerModalOpen(true)}
        />

        {/* Global Loading Indicator */}
        {(acceptMutation.isPending || reviewMutation.isPending || closeMutation.isPending) && (
          <div className="mt-4 text-sm font-medium text-[#22D3EE] animate-pulse">
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
        availableUsers={MOCK_INVESTIGATORS}
      />

      <AssignUserModal
        isOpen={isActionOwnerModalOpen}
        onClose={() => setIsActionOwnerModalOpen(false)}
        onConfirm={handleConfirmActionOwner}
        isLoading={assignActionOwnerMutation.isPending}
        title="Assign Action Owner"
        description="Select an action owner to implement corrective actions."
        availableUsers={MOCK_ACTION_OWNERS}
      />
    </div>
  );
};