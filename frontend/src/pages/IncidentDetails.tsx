import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepartmentIncidents } from '../hooks/useIncidents';

export const IncidentDetails: React.FC = () => {
  // 1. Get the incident ID from the URL (e.g., /incidents/1)
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const departmentId = 1; // Hardcoded for now
  
  // 2. Fetch all incidents and find the one we need
  // Note: In a real app, we might create a separate API endpoint to fetch a single incident by ID.
  // For now, since we already have the list cached, we can just find it from the list.
  const { data: incidents, isLoading } = useDepartmentIncidents(departmentId);
  
  const incident = incidents?.find(inc => inc.id === Number(id));

  if (isLoading) return <div className="p-8 text-center">Loading details...</div>;
  
  if (!incident) return (
    <div className="p-8 text-center">
      <h2 className="text-xl text-red-600">Incident not found</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Go back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {incident.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Reported on: {new Date(incident.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">
            {incident.description}
          </p>
        </div>

        {/* People Involved */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-semibold text-gray-500 uppercase">Reporter</h4>
            <p className="text-gray-900 font-medium">{incident.reporter?.name || 'Unknown'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-semibold text-gray-500 uppercase">Investigator</h4>
            <p className="text-gray-900 font-medium">{incident.investigator?.name || 'Not assigned yet'}</p>
          </div>
        </div>

        {/* Action Buttons Placeholder */}
        <div className="border-t pt-6 flex gap-4">
          <p className="text-gray-500 italic text-sm">Action buttons (Accept, Reject, etc.) will go here...</p>
        </div>

      </div>
    </div>
  );
};