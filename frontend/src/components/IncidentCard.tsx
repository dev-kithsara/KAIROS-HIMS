import React from 'react';
import type { Incident } from '../types/incident';

// Define the Props (inputs) this component expects
interface IncidentCardProps {
  incident: Incident;
  onClick: () => void; // Function to run when the card is clicked
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
    onClick={onClick}
    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
  >
    {/* Header */}
    <div className="border-b border-slate-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            {incident.title}
          </h3>

          <p className="mt-2 text-sm text-slate-500 line-clamp-2">
            {incident.description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getStatusColor(
            incident.status
          )}`}
        >
          {incident.status.replace("_", " ")}
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="space-y-3 p-5 text-sm">

      <div className="flex items-center justify-between">
        <span className="text-slate-500">Severity</span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            incident.severity === "HIGH"
              ? "bg-red-100 text-red-700"
              : incident.severity === "MEDIUM"
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {incident.severity}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-slate-500">Category</span>
        <span className="font-medium text-slate-800">
          {incident.category}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-slate-500">Reporter</span>
        <span className="font-medium text-slate-800">
          {incident.reporter?.name || "Unknown"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-slate-500">Department</span>
        <span className="font-medium text-slate-800">
          {incident.department?.name || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-slate-500">Created</span>
        <span className="font-medium text-slate-800">
          {formattedDate}
        </span>
      </div>
    </div>

    {/* Footer */}
    <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-700">
          View Investigation
        </span>

        <span className="text-blue-700 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </div>
  </div>
);
}