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

  const handleRoleChange = async (
    userId: number,
    newRole: 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER'
  ) => {
    try {
      setUpdatingUserId(userId);
      await managerApi.updateTeamRole(userId, newRole);
      toast.success(`Role updated to ${newRole.replace('_', ' ')}.`);
      setTeam((prev) =>
        prev.map((member) => (member.id === userId ? { ...member, role: newRole } : member))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Role update rejected.');
    } finally {
      setUpdatingUserId(null);
    }
  };

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

      {/* ── Search & Filter Controls ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search team member by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'INVESTIGATOR', 'ACTION_OWNER', 'STAFF'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === role
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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

                    <td className="p-4 text-slate-600">
                      <div className="space-y-0.5 text-[11px]">
                        <p>
                          Investigated:{' '}
                          <span className="font-semibold text-slate-800">
                            {member._count?.investigatedIncidents ?? 0}
                          </span>
                        </p>
                        <p>
                          Owned Actions:{' '}
                          <span className="font-semibold text-slate-800">
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
                            handleRoleChange(
                              member.id,
                              e.target.value as 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER'
                            )
                          }
                          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
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
    </div>
  );
};

export default ManagerTeam;