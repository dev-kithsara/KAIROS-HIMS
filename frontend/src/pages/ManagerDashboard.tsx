import React from 'react';
import { useDepartmentIncidents } from '../hooks/useIncidents';
import { IncidentCard } from '../components/IncidentCard';
import { useNavigate } from 'react-router-dom';

export const ManagerDashboard: React.FC = () => {
  // Hardcoding department ID to 1 for now. 
  // In a real app, this comes from the logged-in user's Context/Redux store.
  const departmentId = 1;
  
  // React Router's navigation hook
  const navigate = useNavigate();

  // Using our Custom Hook to fetch data
  const { data: incidents, isLoading, isError, error } = useDepartmentIncidents(departmentId);

  // Handle click on a card
  const handleIncidentClick = (incidentId: number) => {
    navigate(`/incidents/${incidentId}`);
  };

  // UI for Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // UI for Error State
  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          <h2 className="font-bold text-lg mb-2">Error loading incidents</h2>
          <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  // UI for Empty State
  if (!incidents || incidents.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Department Incidents</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">No incidents found for your department.</p>
        </div>
      </div>
    );
  }

  // Main UI (Success State)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and track incidents in your department.</p>
        </div>

        {/* Grid of Incident Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incidents.map((incident) => (
            <IncidentCard 
              key={incident.id} 
              incident={incident} 
              onClick={handleIncidentClick} 
            />
          ))}
        </div>

      </div>
    </div>
  );
};