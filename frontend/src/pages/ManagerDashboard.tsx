// frontend/src/pages/ManagerDashboard.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartmentIncidents } from '../hooks/useIncidents';
import { IncidentCard } from '../components/IncidentCard';
import { useAuthContext } from '../context/AuthContext';

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Read departmentId from the logged-in user's context.
  // Falls back to 1 for backward compatibility during dev.
  const departmentId = user?.departmentId ?? 1;

  // Using our Custom Hook to fetch data
  const { data: incidents, isLoading, isError, error } = useDepartmentIncidents(departmentId);

  // =========================================================================
  // STATE MANAGEMENT FOR FILTERS
  // =========================================================================
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // =========================================================================
  // FILTERING LOGIC (useMemo for performance)
  // =========================================================================
  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];

    return incidents.filter((incident) => {
      // 1. Check if it matches the status filter
      const matchesStatus = statusFilter === 'ALL' || incident.status === statusFilter;

      // 2. Check if it matches the search term (in title or reporter name)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        incident.title.toLowerCase().includes(searchLower) ||
        (incident.reporter?.name || '').toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [incidents, searchTerm, statusFilter]);

  // =========================================================================
  // UI: LOADING STATE
  // =========================================================================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // =========================================================================
  // UI: ERROR STATE
  // =========================================================================
  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <h3 className="text-red-800 font-medium">Error loading incidents</h3>
        <p className="text-red-600 text-sm mt-1">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  // =========================================================================
  // UI: MAIN DASHBOARD
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Header Section with Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#111827] p-6 rounded-xl shadow-lg border border-[#1E293B]">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">Manager Dashboard</h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage and track incidents in your department.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#1E293B]/60 border border-[#1E293B] text-[#F1F5F9] placeholder-[#94A3B8] rounded-lg focus:outline-none focus:border-[#22D3EE] text-sm w-full sm:w-64 transition-all"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#1E293B] border border-[#1E293B] text-[#F1F5F9] rounded-lg focus:outline-none focus:border-[#22D3EE] text-sm cursor-pointer transition-all"
          >
            <option value="ALL" className="bg-[#111827]">All Statuses</option>
            <option value="OPEN" className="bg-[#111827]">Open</option>
            <option value="ACCEPTED" className="bg-[#111827]">Accepted</option>
            <option value="INVESTIGATING" className="bg-[#111827]">Investigating</option>
            <option value="PENDING_ACTION" className="bg-[#111827]">Pending Action</option>
            <option value="UNDER_REVIEW" className="bg-[#111827]">Under Review</option>
            <option value="CLOSED" className="bg-[#111827]">Closed</option>
            <option value="REJECTED" className="bg-[#111827]">Rejected</option>
          </select>
        </div>
      </div>

      {/* Conditional Rendering: Empty State vs Grid */}
      {filteredIncidents.length === 0 ? (
        // Empty State UI
        <div className="bg-[#111827] p-12 rounded-xl shadow-lg border border-[#1E293B] text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#94A3B8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#F1F5F9]">No incidents found</h3>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-sm">
            {searchTerm || statusFilter !== 'ALL'
              ? "We couldn't find any incidents matching your current filters. Try adjusting them."
              : 'There are currently no incidents reported in your department.'}
          </p>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="mt-4 text-sm text-[#22D3EE] font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        // Grid of Incident Cards
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={() => navigate(`/incidents/${incident.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
