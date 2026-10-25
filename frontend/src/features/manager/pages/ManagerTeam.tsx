// frontend/src/features/manager/pages/ManagerTeam.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { managerApi } from '../api/manager.api';
import toast from 'react-hot-toast';
import type { DepartmentUser } from '../api/manager.api';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Briefcase,
  Mail,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const ManagerTeam: React.FC = () => {
  const [team, setTeam] = useState<
    (DepartmentUser & {
      createdAt?: string;
      _count?: { investigatedIncidents: number; assignedCapaActions: number };
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'INVESTIGATOR' | 'ACTION_OWNER' | 'STAFF'>(
    'ALL'
  );
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

    // ---------------------------------------------------------
  // State: Holds pending role assignment awaiting manager confirmation
  // ---------------------------------------------------------
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: number;
    userName: string;
    currentRole: string;
    newRole: 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER';
    investigatedCount: number;
    ownedActionsCount: number;
  } | null>(null);

  // ---------------------------------------------------------
  // Step 1: Intercept dropdown change and trigger confirmation dialog
  // ---------------------------------------------------------
  const initiateRoleChange = (
    member: (typeof team)[0],
    newRole: 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER'
  ) => {
    // If selecting the exact same role, do nothing
    if (member.role === newRole) return;

    setPendingRoleChange({
      userId: member.id,
      userName: member.name,
      currentRole: member.role,
      newRole,
      investigatedCount: member._count?.investigatedIncidents ?? 0,
      ownedActionsCount: member._count?.assignedCapaActions ?? 0,
    });
  };

  // ---------------------------------------------------------
  // Step 2: Confirm and execute the role change via API
  // ---------------------------------------------------------
  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    const { userId, newRole } = pendingRoleChange;

    try {
      setUpdatingUserId(userId);
      // Pass force: true and rationale to allow confirmed manager reassignment
      await managerApi.updateTeamRole(
        userId, 
        newRole, 
        true, 
        'Reassigned by Department Manager via Confirmation Modal'
      );
      toast.success(`Role successfully updated to ${newRole.replace('_', ' ')}.`);
      
      // Update local state
      setTeam((prev) =>
        prev.map((member) => (member.id === userId ? { ...member, role: newRole } : member))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Role update rejected by server.');
    } finally {
      setUpdatingUserId(null);
      setPendingRoleChange(null); // Close dialog
    }
  };

  const loadTeamData = async () => {
    try {
      setIsLoading(true);
      const res = await managerApi.getDepartmentTeam();
      setTeam(res.users);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load department team personnel.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, []);


  // Metrics
  const counts = useMemo(() => {
    return {
      total: team.length,
      investigators: team.filter((u) => u.role === 'INVESTIGATOR').length,
      actionOwners: team.filter((u) => u.role === 'ACTION_OWNER').length,
      generalStaff: team.filter((u) => u.role === 'STAFF').length,
    };
  }, [team]);

  // Filtered List
  const filteredUsers = useMemo(() => {
    return team.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      if (roleFilter === 'ALL') return true;
      return u.role === roleFilter;
    });
  }, [team, searchTerm, roleFilter]);

  // ---------------------------------------------------------
// Helper: Determine workload saturation level for an investigator
// based on the number of incidents they have investigated.
// Returns label, color classes, and icon for the badge.
// ---------------------------------------------------------
const getWorkloadBadge = (count: number): { label: string; classes: string; dot: string } => {
  if (count >= 10) {
    // Heavy Load: Clinically risky — may cause investigation delays
    return {
      label: `Investigated: ${count} (Heavy Load ⚠️)`,
      classes: 'text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5',
      dot: 'bg-red-500',
    };
  } else if (count >= 5) {
    // Moderate Load: Approaching capacity
    return {
      label: `Investigated: ${count} (Moderate Load)`,
      classes: 'text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5',
      dot: 'bg-amber-500',
    };
  } else {
    // Available: Safe capacity
    return {
      label: `Investigated: ${count}`,
      classes: 'text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5',
      dot: 'bg-emerald-500',
    };
  }
};

  const roleBadgeClasses: Record<string, string> = {
    STAFF: 'bg-slate-100 text-slate-700 border-slate-200',
    INVESTIGATOR: 'bg-purple-100 text-purple-800 border-purple-200',
    ACTION_OWNER: 'bg-amber-100 text-amber-800 border-amber-200',
    MANAGER: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Department Team Delegation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Delegate clinical governance responsibilities, Lead Investigators, and CAPA Action Owners.
          </p>
        </div>
        <button
          onClick={loadTeamData}
          className="px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Refresh Team
        </button>
      </div>

      {/* ── Metric Summary Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Personnel</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{counts.total}</p>
          <p className="text-[11px] text-slate-500 mt-1">Department staff roster</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Investigators</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">{counts.investigators}</p>
          <p className="text-[11px] text-slate-500 mt-1">Authorized for RCA findings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Action Owners</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{counts.actionOwners}</p>
          <p className="text-[11px] text-slate-500 mt-1">Assigned to execute CAPAs</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Clinical Staff</span>
            <UserCheck className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{counts.generalStaff}</p>
          <p className="text-[11px] text-slate-500 mt-1">General incident reporters</p>
        </div>
      </div>

            {/* ── Search & Filter Controls (HIMS Deep Navy #1E2B58 Design Tokens) ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          {/* Search Input: Styled with HIMS Official Deep Navy focus ring & border */}
          <input
            type="text"
            placeholder="Search team member by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1E2B58] focus:ring-2 focus:ring-[#1E2B58]/20 transition-all shadow-xs"
          />
        </div>

        {/* Role Filter Pills: Active filter uses HIMS Official Deep Navy (#1E2B58) */}
        <div className="flex items-center gap-2">
          {(['ALL', 'INVESTIGATOR', 'ACTION_OWNER', 'STAFF'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                roleFilter === role
                  ? 'bg-[#1E2B58] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* ── Staff Roster & Role Delegation Table ─────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading department staff...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <UserX className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            No department staff members found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Official Contact</th>
                  <th className="p-4">Assigned Active Duties</th>
                  <th className="p-4">Governance Role</th>
                  <th className="p-4 text-right">Role Delegation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.name}</p>
                          <p className="text-[11px] text-slate-400">ID: #{member.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {member.email}
                      </span>
                    </td>

              <td className="p-4">
              <div className="space-y-1.5 text-[11px]">
                {/* Workload Saturation Badge — color-coded by investigation count */}
                {(() => {
                  const invCount = member._count?.investigatedIncidents ?? 0;
                  const badge = getWorkloadBadge(invCount);
                  return (
                    <span className={`inline-flex items-center gap-1.5 font-semibold ${badge.classes}`}>
                      {/* Colored dot showing saturation status */}
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} shrink-0`} />
                      {badge.label}
                    </span>
                  );
                })()}
                {/* CAPA Action count — plain text (no threshold for now) */}
                <p className="text-slate-500">
                  Owned Actions:{' '}
                  <span className="font-semibold text-slate-700">
                    {member._count?.assignedCapaActions ?? 0}
                  </span>
                </p>
              </div>
            </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-semibold border text-[11px] ${
                          roleBadgeClasses[member.role] || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {member.role === 'MANAGER' ? (
                        <span className="text-[11px] text-slate-400 italic">Department Manager</span>
                      ) : (
                        <select
                          disabled={updatingUserId === member.id}
                          value={member.role}
                          onChange={(e) =>
                            initiateRoleChange(
                              member,
                              e.target.value as 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER'
                            )
                          }
                          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="STAFF">Clinical Staff (Reporter)</option>
                          <option value="INVESTIGATOR">Lead Investigator</option>
                          <option value="ACTION_OWNER">CAPA Action Owner</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>

          {/* ── Role Reassignment Confirmation Modal ───────────────────────── */}
      {pendingRoleChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Role Reassignment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clinical governance delegation check
                </p>
              </div>
            </div>

            {/* Target Personnel & Role Transition */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Personnel:</span>
                <span className="font-bold text-slate-900">{pendingRoleChange.userName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Role:</span>
                <span className="font-semibold text-slate-700">
                  {pendingRoleChange.currentRole.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-slate-500">New Proposed Role:</span>
                <span className="font-black text-indigo-700">
                  {pendingRoleChange.newRole.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Orphaned Duty Warning Banner (Triggered if active duties exist) */}
            {(pendingRoleChange.investigatedCount > 0 || pendingRoleChange.ownedActionsCount > 0) && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Active Duties Warning
                </p>
                <p className="text-[11px] leading-relaxed text-rose-700">
                  <strong>{pendingRoleChange.userName}</strong> currently has{' '}
                  {pendingRoleChange.investigatedCount > 0 && (
                    <span><strong>{pendingRoleChange.investigatedCount}</strong> active investigation(s)</span>
                  )}
                  {pendingRoleChange.investigatedCount > 0 && pendingRoleChange.ownedActionsCount > 0 && ' and '}
                  {pendingRoleChange.ownedActionsCount > 0 && (
                    <span><strong>{pendingRoleChange.ownedActionsCount}</strong> CAPA action(s)</span>
                  )}
                  . Demoting or changing their role may orphan open clinical governance cases.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={updatingUserId !== null}
                onClick={() => setPendingRoleChange(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingUserId !== null}
                onClick={confirmRoleChange}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                {updatingUserId !== null ? 'Updating...' : 'Yes, Reassign Role'}
              </button>
            </div>
          </div>
        </div>
      )}
   </div>
  );
};

export default ManagerTeam;