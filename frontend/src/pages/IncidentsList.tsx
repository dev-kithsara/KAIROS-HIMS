import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartmentIncidents } from '../hooks/useIncidents';
import { useAuthContext } from '../context/AuthContext';
import { getDepartmentName } from '../utils/constants';

export const IncidentsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const departmentId = user?.departmentId || 1;

  // Fetch data using our custom hook
  const { data: incidents, isLoading, isError, error } = useDepartmentIncidents(departmentId);

  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  // Memoized filtering logic to improve performance
  const filteredIncidents = useMemo(() => {
    if (!incidents) return [];

    return incidents.filter((incident) => {
      const matchesStatus = statusFilter === 'ALL' || incident.status === statusFilter;
      const matchesSeverity = severityFilter === 'ALL' || incident.severity === severityFilter;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        incident.title.toLowerCase().includes(searchLower) ||
        (incident.reporter?.name || '').toLowerCase().includes(searchLower) ||
        incident.id.toString().includes(searchLower);

      return matchesStatus && matchesSeverity && matchesSearch;
    });
  }, [incidents, searchTerm, statusFilter, severityFilter]);

  // Helper function to get badge colors for Status
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20',
      ACCEPTED: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20',
      INVESTIGATING: 'bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20',
      PENDING_ACTION: 'bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/20',
      UNDER_REVIEW: 'bg-[#FDE047]/10 text-[#FDE047] border-[#FDE047]/20',
      CLOSED: 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20',
      REJECTED: 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/20',
    };
    const colorClass = colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    return (
      <span
        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}
      >
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Helper function to get badge colors for Severity
  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      CRITICAL: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
      HIGH: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
      MEDIUM: 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20',
      LOW: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    };
    const colorClass = colors[severity] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${colorClass}`}>
        {severity}
      </span>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4DC4B5]"></div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-lg">
        <h3 className="text-[#EF4444] font-medium">Error loading incidents</h3>
        <p className="text-[#EF4444]/80 text-sm mt-1">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#EEF7FC] tracking-tight">Incidents</h1>
          <p className="text-[#8FA8B4] text-sm mt-1">{filteredIncidents.length} total incidents</p>
        </div>

        {/* Export Button (Placeholder for future feature) */}
        <button className="px-4 py-2 bg-[#0E1720] border border-[#253642] text-[#EEF7FC] text-sm font-medium rounded-lg hover:bg-[#253642] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-[#0E1720] p-4 rounded-xl border border-[#253642] flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-[#8FA8B4]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search incidents by ID, title, or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#090F16] border border-[#253642] rounded-lg text-[#EEF7FC] placeholder-[#8FA8B4] focus:outline-none focus:border-[#4DC4B5] focus:ring-1 focus:ring-[#4DC4B5] transition-all text-sm"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#090F16] border border-[#253642] rounded-lg text-[#EEF7FC] focus:outline-none focus:border-[#4DC4B5] text-sm cursor-pointer min-w-[160px]"
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

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#090F16] border border-[#253642] rounded-lg text-[#EEF7FC] focus:outline-none focus:border-[#4DC4B5] text-sm cursor-pointer min-w-[160px]"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-[#0E1720] rounded-xl border border-[#253642] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#090F16] border-b border-[#253642] text-xs font-semibold text-[#8FA8B4] uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#253642]">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#8FA8B4]">
                    No incidents found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => navigate(`/incidents/${incident.id}`)}
                    className="hover:bg-[#253642]/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-sm text-[#8FA8B4]">#{incident.id}</td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#EEF7FC] group-hover:text-[#4DC4B5] transition-colors">
                        {incident.title}
                      </div>
                    </td>

                    <td className="px-6 py-4">{getSeverityBadge(incident.severity)}</td>
                    <td className="px-6 py-4">{getStatusBadge(incident.status)}</td>
                    <td className="px-6 py-4 text-sm text-[#8FA8B4]">{incident.category}</td>
                    <td className="px-6 py-4 text-sm text-[#8FA8B4]">
                      {getDepartmentName(incident.departmentId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#8FA8B4]">
                      {incident.reporter?.name || 'Unknown'}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#8FA8B4] whitespace-nowrap">
                      {new Date(incident.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
