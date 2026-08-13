import React from 'react';
import { useAuthContext } from '../context/AuthContext';
<<<<<<< Updated upstream
=======
import { useDepartmentAnalytics } from '../hooks/useIncidents';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
>>>>>>> Stashed changes

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuthContext();
<<<<<<< Updated upstream

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
=======
  const departmentId = user?.departmentId || 1;

  // Fetch analytics data
  const { data: stats, isLoading, isError } = useDepartmentAnalytics(departmentId);

  // Colors for the Pie Chart (Status)
  const STATUS_COLORS: Record<string, string> = {
    OPEN: '#38BDF8',
    ACCEPTED: '#2DD4BF',
    INVESTIGATING: '#60A5FA',
    PENDING_ACTION: '#FBBF24',
    UNDER_REVIEW: '#FDE047',
    CLOSED: '#4ADE80',
    REJECTED: '#F87171',
  };

  // Colors for the Bar Chart (Severity)
  const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: '#EF4444',
    HIGH: '#F97316',
    MEDIUM: '#EAB308',
    LOW: '#22C55E',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DC4B5]"></div>
>>>>>>> Stashed changes
      </div>
    );
  }

<<<<<<< Updated upstream
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
=======
  if (isError || !stats) {
    return (
      <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-lg">
        <h3 className="text-[#EF4444] font-medium">Error loading analytics</h3>
>>>>>>> Stashed changes
      </div>
    );
  }

<<<<<<< Updated upstream
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
=======
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#0E1720] p-6 rounded-xl shadow-sm border border-[#253642]">
        <div>
          <h1 className="text-2xl font-bold text-[#EEF7FC] tracking-tight">
            Good afternoon, {user?.name}
          </h1>
          <p className="text-[#8FA8B4] text-sm mt-1">
            Here's what's happening in your incident management system.
          </p>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Incidents */}
        <div className="bg-[#0E1720] p-6 rounded-xl border border-[#253642] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#8FA8B4] uppercase tracking-wider">Total</p>
              <h3 className="text-3xl font-bold text-[#EEF7FC] mt-2">{stats.summary.total}</h3>
              <p className="text-xs text-[#8FA8B4] mt-1">All time</p>
            </div>
            <div className="p-2 bg-[#4DC4B5]/10 rounded-lg">
              <svg
                className="w-5 h-5 text-[#4DC4B5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Open Incidents */}
        <div className="bg-[#0E1720] p-6 rounded-xl border border-[#253642] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#8FA8B4] uppercase tracking-wider">Open</p>
              <h3 className="text-3xl font-bold text-[#EEF7FC] mt-2">{stats.summary.open}</h3>
              <p className="text-xs text-[#8FA8B4] mt-1">Needs attention</p>
            </div>
            <div className="p-2 bg-[#EF4444]/10 rounded-lg">
              <svg
                className="w-5 h-5 text-[#EF4444]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
>>>>>>> Stashed changes
        </div>

        {/* Critical Incidents */}
        <div className="bg-[#0E1720] p-6 rounded-xl border border-[#253642] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#8FA8B4] uppercase tracking-wider">
                Critical
              </p>
              <h3 className="text-3xl font-bold text-[#EEF7FC] mt-2">{stats.summary.critical}</h3>
              <p className="text-xs text-[#8FA8B4] mt-1">Highest priority</p>
            </div>
            <div className="p-2 bg-[#F97316]/10 rounded-lg">
              <svg
                className="w-5 h-5 text-[#F97316]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Closed Incidents */}
        <div className="bg-[#0E1720] p-6 rounded-xl border border-[#253642] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#8FA8B4] uppercase tracking-wider">
                Closed
              </p>
              <h3 className="text-3xl font-bold text-[#EEF7FC] mt-2">{stats.summary.closed}</h3>
              <p className="text-xs text-[#8FA8B4] mt-1">Resolved</p>
            </div>
            <div className="p-2 bg-[#4ADE80]/10 rounded-lg">
              <svg
                className="w-5 h-5 text-[#4ADE80]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Status Distribution */}
        <div className="bg-[#0E1720] p-6 rounded-xl border border-[#253642] shadow-sm">
          <h3 className="text-lg font-semibold text-[#EEF7FC] mb-6">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.charts.byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.charts.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8FA8B4'} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0E1720',
                    borderColor: '#253642',
                    color: '#EEF7FC',
                  }}
                  itemStyle={{ color: '#EEF7FC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {stats.charts.byStatus.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[entry.name] || '#8FA8B4' }}
                ></div>
                <span className="text-xs text-[#8FA8B4]">
                  {entry.name.replace('_', ' ')} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Severity Breakdown */}
        <div className="bg-[#0E1720] p-6 rounded-xl border border-[#253642] shadow-sm">
          <h3 className="text-lg font-semibold text-[#EEF7FC] mb-6">Severity Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.bySeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#253642" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#8FA8B4"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#8FA8B4"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0E1720',
                    borderColor: '#253642',
                    color: '#EEF7FC',
                  }}
                  cursor={{ fill: '#253642', opacity: 0.4 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.charts.bySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#8FA8B4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
