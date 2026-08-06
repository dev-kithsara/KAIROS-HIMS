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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manager Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64 transition-shadow"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white cursor-pointer transition-shadow"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="PENDING_ACTION">Pending Action</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Conditional Rendering: Empty State vs Grid */}
      {filteredIncidents.length === 0 ? (
        // Empty State UI
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <h3 className="text-lg font-semibold text-gray-900">No incidents found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            {searchTerm || statusFilter !== 'ALL'
              ? "We couldn't find any incidents matching your current filters. Try adjusting them."
              : 'There are currently no incidents reported in your department.'}
          </p>

          {/* Clear Filters Button (Only shows if a filter is active) */}
          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        // Grid of Incident Cards
        // Updated grid classes to look better on large screens (xl:grid-cols-3)
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
