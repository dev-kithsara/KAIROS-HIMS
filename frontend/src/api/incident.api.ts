import axios from 'axios';
import type { Incident, ApiResponse } from '../types/incident';

// Base URL for the incidents API. 
// Note: In Vite, we usually set up a proxy in vite.config.ts to forward '/api' to 'http://localhost:5000'
const API_URL = '/api/incidents';

/**
 * Fetch all incidents for a specific department
 */
export const getDepartmentIncidents = async (departmentId: number): Promise<Incident[]> => {
  // We use axios.get<ApiResponse<Incident[]>> to tell TypeScript what shape of data to expect back
  const response = await axios.get<ApiResponse<Incident[]>>(`${API_URL}/department/${departmentId}`);
  return response.data.data;
};

/**
 * Accept an OPEN incident
 */
export const acceptIncident = async (id: number): Promise<Incident> => {
  const response = await axios.patch<ApiResponse<Incident>>(`${API_URL}/${id}/accept`);
  return response.data.data;
};

/**
 * Reject an OPEN incident with a reason
 */
export const rejectIncident = async (id: number, reason: string): Promise<Incident> => {
  // The second argument in axios.patch is the Request Body
  const response = await axios.patch<ApiResponse<Incident>>(`${API_URL}/${id}/reject`, { reason });
  return response.data.data;
};

/**
 * Assign an investigator to an ACCEPTED incident
 */
export const assignInvestigator = async (id: number, investigatorId: number): Promise<Incident> => {
  const response = await axios.patch<ApiResponse<Incident>>(`${API_URL}/${id}/assign-investigator`, { investigatorId });
  return response.data.data;
};

/**
 * Assign an action owner to an INVESTIGATING incident
 */
export const assignActionOwner = async (id: number, actionOwnerId: number): Promise<Incident> => {
  const response = await axios.patch<ApiResponse<Incident>>(`${API_URL}/${id}/assign-action-owner`, { actionOwnerId });
  return response.data.data;
};

/**
 * Mark an incident as UNDER_REVIEW
 */
export const reviewIncident = async (id: number): Promise<Incident> => {
  const response = await axios.patch<ApiResponse<Incident>>(`${API_URL}/${id}/review`);
  return response.data.data;
};

/**
 * Close the incident
 */
export const closeIncident = async (id: number): Promise<Incident> => {
  const response = await axios.patch<ApiResponse<Incident>>(`${API_URL}/${id}/close`);
  return response.data.data;
};

/**
 * Submit a new incident report with optional evidence attachments
 */
export const createIncident = async (formData: FormData): Promise<Incident> => {
  const response = await axios.post<{ success: boolean; message: string; incident: Incident }>(
    `${API_URL}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.incident;
};