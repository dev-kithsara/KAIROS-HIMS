// frontend/src/components/IncidentCard.tsx

import React from 'react';
import type { Incident } from '../types/incident';

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void; // Updated to match the fix you applied
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED':
        return 'bg-indigo-100 text-indigo-800';
      case 'INVESTIGATING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_ACTION':
        return 'bg-orange-100 text-orange-800';
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'CLOSED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function for Severity Colors
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-400 text-gray-900';
      case 'LOW':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const formattedDate = new Date(incident.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative overflow-hidden"
    >
      {/* A small color bar at the top indicating severity */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${getSeverityColor(incident.severity).split(' ')[0]}`}
      ></div>

      <div className="flex justify-between items-start mb-3 mt-1">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">{incident.title}</h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}
        >
          {incident.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{incident.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-medium">Reporter:</span> {incident.reporter?.name || 'Unknown'}
          {/* Severity Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityColor(incident.severity)}`}
          >
            {incident.severity}
          </span>
        </div>
        <div>{formattedDate}</div>
      </div>
    </div>
  );
};
