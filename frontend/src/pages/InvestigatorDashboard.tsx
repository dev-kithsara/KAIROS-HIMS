import React from "react";
import { IncidentCard } from '../components/IncidentCard';
import { useAssignedIncidents } from '../hooks/useIncidents';
import { useNavigate } from 'react-router-dom';



const InvestigatorDashboard = () => {

    const navigate = useNavigate();
    const { 
        data: incidents,
        isLoading,
        isError,
        error,
    } = useAssignedIncidents();

    const handleIncidentClick = (incidentId: number) => {
        navigate(`/incidents/${incidentId}`);
    };
// Show loading spinner while data is being fetched
if (isLoading) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
// Error State  ← Add it here
    if (isError) {
        return (
            <div className="p-8 text-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
                    <h2 className="font-bold text-lg mb-2">
                        Error loading incidents
                    </h2>

                    <p>
                        {error instanceof Error
                            ? error.message
                            : "Unknown error occurred"}
                    </p>
                </div>
            </div>
        );
    }

    // Empty State
if (!incidents || incidents.length === 0) {
  return (
    <div className="p-8 text-center bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Investigator Dashboard
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">
          No assigned incidents found.
        </p>
      </div>
    </div>
  );
}


   return (
  <div className="p-6 bg-gray-50 min-h-screen">
    <h1 className="text-2xl font-bold mb-6">
      Investigator Dashboard
    </h1>

    <h2 className="text-xl font-semibold mb-4">
      Assigned Incidents
    </h2>

    <div className="grid gap-4">
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onClick={handleIncidentClick}
        />
      ))}
    </div>

  </div>
);
};


export default InvestigatorDashboard;