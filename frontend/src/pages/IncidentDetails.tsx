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

// --- Mock Data ---
// TODO: Replace these with actual API calls (e.g., useUsersByRole hook) in the future
const MOCK_INVESTIGATORS = [{ id: 2, name: 'Nimal Investigator', role: 'INVESTIGATOR' }];
const MOCK_ACTION_OWNERS = [{ id: 6, name: 'Sunil Action Owner', role: 'ACTION_OWNER' }];

export const IncidentDetails: React.FC = () => {
  // 1. ROUTING & PARAMS
  // Extract the incident ID from the URL (e.g., /incidents/123)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Hardcoded department ID for now (will come from Auth/Context later)
  const departmentId = 1; 
  
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        
        {/* Navigation: Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium"
        >
          &larr; Back to Dashboard
        </button>

        {/* Header Section: Title and Current Status */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-bold tracking-wider">
              {/* Replace underscores with spaces for better readability (e.g., PENDING_ACTION -> PENDING ACTION) */}
              {incident.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Reported on: {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
            {incident.description}
          </p>
        </div>

        {/* People Involved Section: Displays assigned personnel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Reporter</h4>
            <p className="text-gray-900 font-medium">{incident.reporter?.name || 'Unknown'}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
            <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Investigator</h4>
            <p className="text-gray-900 font-medium">{incident.investigator?.name || 'Not assigned'}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Action Owner</h4>
            <p className="text-gray-900 font-medium">{incident.actionOwner?.name || 'Not assigned'}</p>
          </div>
        </div>

        {/* Action Buttons Component: Renders buttons dynamically based on incident.status */}
        <IncidentActions 
          incident={incident}
          onAccept={handleAccept}
          onReview={handleReview}
          onClose={handleClose}
          // For complex actions, we just open the respective modal here
          onReject={() => setIsRejectModalOpen(true)}
          onAssignInvestigator={() => setIsInvestigatorModalOpen(true)}
          onAssignActionOwner={() => setIsActionOwnerModalOpen(true)}
        />

        {/* Global Loading Indicator: Shows if any of the direct mutations are currently running */}
        {(acceptMutation.isPending || reviewMutation.isPending || closeMutation.isPending) && (
          <div className="mt-4 text-sm font-medium text-blue-600 animate-pulse">
            Processing action, please wait...
          </div>
        )}

      </div>

      {/* --- Modals (Rendered outside the main card flow, controlled by state) --- */}

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