// frontend/src/features/manager/pages/ManagerAnalytics.tsx

import React, { Component, type ErrorInfo, type ReactNode, useState, useEffect } from 'react';
import { managerApi } from '../api/manager.api';
import type { ManagerAnalyticsData } from '../api/manager.api';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  AlertTriangle,
  FolderKanban,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

// ── In-Component Error Boundary ───────────────────────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AnalyticsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Analytics Crash Caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center max-w-xl mx-auto my-12">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-rose-900">Analytics Rendering Interrupted</h3>
          <p className="text-xs text-rose-700 mt-1 mb-4">
            A chart rendering exception occurred. The application recovered safely without crashing the dashboard.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
          >
            Retry Analytics View
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main Analytics View ───────────────────────────────────────────────────
export const ManagerAnalytics: React.FC = () => {
  const [data, setData] = useState<ManagerAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await managerApi.getAnalytics();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load manager analytics:', err);
      setIsError(true);
      setErrorMessage(
        err.response?.data?.message || 'Unable to retrieve department analytics at this time.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Aggregating Clinical Governance Metrics...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <AlertOctagon className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Analytics Unavailable</h3>
        <p className="text-xs text-slate-600 mt-1 mb-5">{errorMessage}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconnect Analytics Engine
        </button>
      </div>
    );
  }

  // Safe Fallback Numbers
  const summary = data.summary ?? {
    totalIncidents: 0,
    openTriage: 0,
    criticalSeverity: 0,
    closedResolved: 0,
    avgResolutionDays: 0,
  };

  // Color Maps
  const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: '#E11D48',
    HIGH: '#F97316',
    MEDIUM: '#FBBF24',
    LOW: '#10B981',
  };

  const STAGE_COLORS: Record<string, string> = {
    OPEN: '#3B82F6',
    ACCEPTED: '#10B981',
    INVESTIGATING: '#8B5CF6',
    PENDING_ACTION: '#F59E0B',
    UNDER_REVIEW: '#06B6D4',
    CLOSED: '#64748B',
    REJECTED: '#EF4444',
  };

  const stageData = (data.workflowStages ?? []).map((item) => ({
    name: item.stage.replace('_', ' '),
    rawName: item.stage,
    value: item.count,
  }));

  const severityData = (data.severityProfile ?? []).map((item) => ({
    name: item.severity,
    count: item.count,
  }));

  const categoryData = (data.topCategories ?? []).map((item) => ({
    category: item.category,
    count: item.count,
  }));

  return (
    <AnalyticsErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Department Clinical Risk Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time clinical incident distribution, resolution velocity, and barrier effectiveness.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Data
          </button>
        </div>

        {/* ── KPI Metric Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Incidents */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
              <FolderKanban className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{summary.totalIncidents ?? 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Logged across department</p>
          </div>

          {/* Open Triage */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Open Triage</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-600 mt-2">{summary.openTriage ?? 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting manager acceptance</p>
          </div>

          {/* Critical Severity */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Critical Risk</span>
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-rose-600 mt-2">{summary.criticalSeverity ?? 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Sentinel / High impact</p>
          </div>

          {/* Closed / Resolved */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Closed Cases</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-2">{summary.closedResolved ?? 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">3-Gate validated closure</p>
          </div>

          {/* Average Resolution Time */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Resolution Velocity</span>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-600 mt-2">
              {summary.avgResolutionDays ?? 0} <span className="text-xs font-medium text-slate-500">days</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Average incident lifecycle</p>
          </div>
        </div>

        {/* ── Charts Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Workflow Lifecycle Distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600" /> Workflow Stage Distribution
              </h3>
              <span className="text-xs text-slate-400">Status breakdown</span>
            </div>

            {stageData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                No active workflow stage data recorded.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stageData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {stageData.map((entry, index) => (
                        <Cell
                          key={`stage-cell-${index}`}
                          fill={STAGE_COLORS[entry.rawName] || '#64748B'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value} incidents`, 'Count']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {stageData.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[s.rawName] || '#64748B' }}
                  />
                  {s.name}: <strong className="text-slate-800">{s.value}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Chart 2: Severity Risk Profile */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Severity Risk Profile
              </h3>
              <span className="text-xs text-slate-400">Risk stratification</span>
            </div>

            {severityData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                No severity stratification data available.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} cases`, 'Incidents']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {severityData.map((entry, index) => (
                        <Cell
                          key={`sev-cell-${index}`}
                          fill={SEVERITY_COLORS[entry.name] || '#3B82F6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((sev) => {
                const count = severityData.find((s) => s.name === sev)?.count ?? 0;
                return (
                  <div key={sev} className="p-2 rounded bg-slate-50 text-[11px]">
                    <span className="font-semibold block" style={{ color: SEVERITY_COLORS[sev] }}>
                      {sev}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Table: Top Clinical Incident Categories ──────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Top Incident Categories in Department
            </h3>
            <span className="text-xs text-slate-400">High-frequency clinical areas</span>
          </div>

          {categoryData.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No categories registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-3">Rank</th>
                    <th className="p-3">Category Name</th>
                    <th className="p-3">Incident Frequency</th>
                    <th className="p-3">Proportion of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoryData.map((cat, idx) => {
                    const pct =
                      summary.totalIncidents > 0
                        ? Math.round((cat.count / summary.totalIncidents) * 100)
                        : 0;
                    return (
                      <tr key={cat.category} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-800">{cat.category}</td>
                        <td className="p-3 font-bold text-indigo-600">{cat.count} cases</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AnalyticsErrorBoundary>
  );
};

export default ManagerAnalytics;