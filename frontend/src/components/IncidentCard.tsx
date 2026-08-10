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
        return 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30';
      case 'ACCEPTED':
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30';
      case 'INVESTIGATING':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30';
      case 'PENDING_ACTION':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30';
      case 'UNDER_REVIEW':
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30';
      case 'CLOSED':
        return 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30';
      case 'REJECTED':
        return 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30';
      default:
        return 'bg-[#1E293B] text-[#94A3B8] border border-[#1E293B]';
    }
  };

  // Helper function for Severity Colors
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#EF4444] text-white';
      case 'HIGH':
        return 'bg-[#EF4444] text-white';
      case 'MEDIUM':
        return 'bg-[#F59E0B] text-slate-900';
      case 'LOW':
        return 'bg-[#22C55E] text-white';
      default:
        return 'bg-[#1E293B] text-[#94A3B8]';
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
      className="group bg-[#111827] rounded-xl shadow-lg p-5 border border-[#1E293B] cursor-pointer hover:border-[#0D9488] hover:shadow-xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Top indicator bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${getSeverityColor(incident.severity).split(' ')[0]}`}
      ></div>

      <div>
        <div className="flex justify-between items-start mb-3 mt-1 gap-2">
          <h3 className="text-lg font-bold text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors truncate">
            {incident.title}
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(incident.status)}`}
          >
            {incident.status.replace('_', ' ')}
          </span>
        </div>

        <p className="text-[#94A3B8] text-sm line-clamp-2 mb-4">{incident.description}</p>
      </div>

      <div className="flex justify-between items-center text-xs text-[#94A3B8] pt-3 border-t border-[#1E293B] mt-auto">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#94A3B8]">Reporter:</span>
          <span className="font-semibold text-[#F1F5F9]">{incident.reporter?.name || 'Unknown'}</span>
          {/* Severity Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide ${getSeverityColor(incident.severity)}`}
          >
            {incident.severity}
          </span>
        </div>
        <div className="font-medium">{formattedDate}</div>
      </div>
    </div>
  );
};
