import React from 'react';
import type { Incident } from '../types/incident';

interface IncidentActionsProps {
  incident: Incident;
  // We will pass these functions from the parent component later
  onAccept?: () => void;
  onReject?: () => void;
  onAssignInvestigator?: () => void;
  onAssignActionOwner?: () => void;
  onReview?: () => void;
  onClose?: () => void;
}

export const IncidentActions: React.FC<IncidentActionsProps> = ({ 
  incident, 
  onAccept, 
  onReject, 
  onAssignInvestigator, 
  onAssignActionOwner, 
  onReview, 
  onClose 
}) => {

  // Helper function to render buttons based on the current status
  const renderButtons = () => {
    switch (incident.status) {
      case 'OPEN':
        return (
          <>
            <button 
              onClick={onAccept}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Accept Incident
            </button>
            <button 
              onClick={onReject}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reject Incident
            </button>
          </>
        );
      case 'ACCEPTED':
    return (
      <button 
        onClick={onAssignInvestigator}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Assign Investigator
      </button>
    );

  case 'INVESTIGATING':
    return (
      <button 
        onClick={onAssignActionOwner}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
      >
        Assign Action Owner
      </button>
    );

  case 'PENDING_ACTION':
    return (
      <button 
        onClick={onReview}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Mark as Under Review
      </button>
    );

  case 'UNDER_REVIEW':
    return (
      <button 
        onClick={onClose}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
      >
        Close Incident
      </button>
    );

  case 'CLOSED':
  case 'REJECTED':
    return (
      <p className="text-gray-500 italic">No further actions can be taken on this incident.</p>
    );

  default:
    return null;
}

};
return (
<div className="flex gap-4 mt-6 border-t pt-6">
{renderButtons()}
</div>
);
};

export default IncidentActions;