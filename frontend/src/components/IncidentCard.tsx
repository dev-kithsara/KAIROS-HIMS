import React from 'react';
import type { Incident } from '../types/incident';

// Define the Props (inputs) this component expects
interface IncidentCardProps {
  incident: Incident;
  onClick: (incidentId: number) => void; // Function to run when the card is clicked
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  
  // A helper function to determine the badge color based on the status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-indigo-100 text-indigo-800';
      case 'INVESTIGATING': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_ACTION': return 'bg-orange-100 text-orange-800';
      case 'UNDER_REVIEW': return 'bg-purple-100 text-purple-800';
      case 'CLOSED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format the date to a readable string
  const formattedDate = new Date(incident.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div 
      onClick={() => onClick(incident.id)}
      className="bg-white rounded-lg shadow-md p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
          {incident.title}
        </h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
          {incident.status.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {incident.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          <span className="font-medium">Reporter:</span> {incident.reporter?.name || 'Unknown'}
        </div>
        <div>
          {formattedDate}
        </div>
      </div>
    </div>
  );
};