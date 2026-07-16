// 1. Define the possible status values exactly as they are in the Backend Prisma Enum
export type IncidentStatus = 'OPEN' | 'ACCEPTED' | 'REJECTED' | 'INVESTIGATING' | 'PENDING_ACTION' | 'UNDER_REVIEW' | 'CLOSED';

// 2. Define a minimal User interface for the related data (reporter, investigator, etc.)
export interface User {
  id: number;
  name: string;
  email: string;
}

// 3. Define the main Incident interface matching the Backend response
export interface Incident {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  rejectionReason?: string; // Optional field (?)
  departmentId: number;
  reporterId: number;
  investigatorId?: number;
  actionOwnerId?: number;
  createdAt: string; // Dates come as ISO strings in JSON
  updatedAt: string;
  
  // Related data that we included using Prisma 'include' in the backend
  reporter?: User;
  investigator?: User;
  actionOwner?: User;
}

// 4. Define a generic API Response interface to match our Backend standard response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}