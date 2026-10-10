// frontend/src/features/manager/api/manager.api.ts

import { apiClient } from '../../../shared/api/axios';

// ── Types & Governance Contracts ──────────────────────────────────────────

export type IncidentStatus =
  | 'OPEN'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'INVESTIGATING'
  | 'PENDING_ACTION'
  | 'UNDER_REVIEW'
  | 'CLOSED';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CapaType = 'CORRECTIVE' | 'PREVENTIVE';
export type CapaPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CapaStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type ControlEffectiveness = 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE';
export type ControlStatus = 'PLANNED' | 'IN_PROGRESS' | 'VERIFIED';
export type ReviewOutcome = 'APPROVED' | 'REVISION_REQUIRED';

export interface DepartmentUser {
  id: number;
  name: string;
  email: string;
  role: 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER' | 'MANAGER' | 'ADMIN';
}

export interface IncidentAttachment {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedAt: string;
}

export interface CapaAction {
  id: number;
  incidentId: number;
  title: string;
  actionType: CapaType;
  priority: CapaPriority;
  dueDate: string;
  actionOwnerId: number;
  actionOwner: DepartmentUser;
  description: string;
  status: CapaStatus;
  evidenceNotes?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: { id: number; name: string };
  verificationNotes?: string;
  createdAt: string;
}

export interface IncidentControl {
  id: number;
  incidentId: number;
  controlType: string;
  effectiveness: ControlEffectiveness;
  status: ControlStatus;
  failureReason?: string;
  requiredImprovement?: string;
  targetDate: string;
  createdAt: string;
}

export interface ManagementReview {
  id: number;
  incidentId: number;
  outcome: ReviewOutcome;
  lessonsLearned: string;
  outcomeComments: string;
  followUpMonitoring: string;
  reviewedById: number;
  reviewedBy: { id: number; name: string };
  reviewedAt: string;
}

export interface LessonsDissemination {
  id: number;
  incidentId: number;
  audience: string;
  scheduledDate: string;
  status: 'SCHEDULED' | 'COMPLETED';
}

export interface IncidentAuditLog {
  id: number;
  incidentId: number;
  userId: number;
  user: { id: number; name: string; role: string };
  action: string;
  reason?: string;
  changes?: string;
  createdAt: string;
}

export interface ManagerIncidentDetail {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  location: string;
  status: IncidentStatus;
  rejectionReason?: string;
  rootCause?: string;
  rootCauseCategory?: string;
  investigationFindings?: string;
  investigationReviewStatus?: 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';
  investigationReviewComment?: string;
  departmentId: number;
  department: { id: number; name: string };
  reporterId: number;
  reporter: DepartmentUser;
  investigatorId?: number;
  investigator?: DepartmentUser;
  actionOwnerId?: number;
  actionOwner?: DepartmentUser;
  closedAt?: string;
  closureSummary?: string;
  closedById?: number;
  closedBy?: { id: number; name: string };
  attachments: IncidentAttachment[];
  capaActions: CapaAction[];
  controls: IncidentControl[];
  managementReview?: ManagementReview;
  disseminations: LessonsDissemination[];
  auditLogs: IncidentAuditLog[];
  createdAt: string;
  updatedAt: string;
}

export interface TriagePayload {
  decision: 'ACCEPT' | 'REVISE' | 'REJECT';
  rationale: string;
}

export interface RecordCorrectionPayload {
  title?: string;
  severity?: Severity;
  category?: string;
  location?: string;
  auditReason: string;
}

export interface AssignInvestigatorPayload {
  investigatorId: number;
}

export interface ReviewInvestigationPayload {
  decision: 'APPROVE' | 'REVISE';
  comments: string;
}

export interface CreateCapaPayload {
  title: string;
  actionType: CapaType;
  priority: CapaPriority;
  dueDate: string;
  actionOwnerId: number;
  description: string;
}

export interface VerifyCapaPayload {
  decision: 'VERIFY' | 'REVISE';
  notes?: string;
}

export interface CreateControlPayload {
  controlType: string;
  effectiveness: ControlEffectiveness;
  status: ControlStatus;
  failureReason?: string;
  requiredImprovement?: string;
  targetDate: string;
}

export interface ManagementReviewPayload {
  outcome: ReviewOutcome;
  lessonsLearned: string;
  outcomeComments: string;
  followUpMonitoring: string;
  dissemination?: {
    audience: string;
    scheduledDate: string;
    status: 'SCHEDULED' | 'COMPLETED';
  };
}

export interface CloseIncidentPayload {
  closureSummary: string;
}

export interface ManagerAnalyticsSummary {
  totalIncidents: number;
  openTriage: number;
  criticalSeverity: number;
  closedResolved: number;
  avgResolutionDays: number;
}

export interface WorkflowStageItem {
  stage: IncidentStatus;
  count: number;
}

export interface SeverityProfileItem {
  severity: Severity;
  count: number;
}

export interface TopCategoryItem {
  category: string;
  count: number;
}

export interface ManagerAnalyticsData {
  summary: ManagerAnalyticsSummary;
  workflowStages: WorkflowStageItem[];
  severityProfile: SeverityProfileItem[];
  topCategories: TopCategoryItem[];
}

export interface DepartmentTeamResponse {
  counts: {
    total: number;
    investigators: number;
    actionOwners: number;
    generalStaff: number;
  };
  users: (DepartmentUser & {
    createdAt: string;
    _count?: {
      investigatedIncidents: number;
      assignedCapaActions: number;
    };
  })[];
}

// ── API Methods ───────────────────────────────────────────────────────────

export const managerApi = {
  getIncidentDetails: async (id: number): Promise<ManagerIncidentDetail> => {
    const response = await apiClient.get<{ success: boolean; data: ManagerIncidentDetail }>(
      `/manager/incidents/${id}`
    );
    return response.data.data;
  },

  getDepartmentTeam: async (): Promise<{ counts: any; users: DepartmentUser[] }> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { counts: any; users: DepartmentUser[] };
    }>('/manager/team');
    return response.data.data;
  },

  updateTeamRole: async (userId: number, role: 'STAFF' | 'INVESTIGATOR' | 'ACTION_OWNER') => {
    const response = await apiClient.patch<{
      success: boolean;
      message: string;
      data: DepartmentUser;
    }>(`/manager/team/${userId}/role`, { role });
    return response.data;
  },

  getAnalytics: async (): Promise<ManagerAnalyticsData> => {
    const response = await apiClient.get<{ success: boolean; data: ManagerAnalyticsData }>(
      '/manager/analytics'
    );
    return response.data.data;
  },

  triageIncident: async (id: number, payload: TriagePayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/triage`, payload);
    return response.data;
  },

  correctRecord: async (id: number, payload: RecordCorrectionPayload) => {
    const response = await apiClient.patch(`/manager/incidents/${id}/correction`, payload);
    return response.data;
  },

  assignInvestigator: async (id: number, payload: AssignInvestigatorPayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/investigator`, payload);
    return response.data;
  },

  reviewInvestigation: async (id: number, payload: ReviewInvestigationPayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/review-investigation`, payload);
    return response.data;
  },

  createCapaAction: async (id: number, payload: CreateCapaPayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/actions`, payload);
    return response.data;
  },

  verifyCapaAction: async (id: number, actionId: number, payload: VerifyCapaPayload) => {
    const response = await apiClient.post(
      `/manager/incidents/${id}/actions/${actionId}/verify`,
      payload
    );
    return response.data;
  },

  createControl: async (id: number, payload: CreateControlPayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/controls`, payload);
    return response.data;
  },

  submitReview: async (id: number, payload: ManagementReviewPayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/review`, payload);
    return response.data;
  },

  closeIncident: async (id: number, payload: CloseIncidentPayload) => {
    const response = await apiClient.post(`/manager/incidents/${id}/close`, payload);
    return response.data;
  },
};