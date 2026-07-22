import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as incidentApi from '../api/incident.api';

// 1. Hook to fetch all incidents for a department
export const useDepartmentIncidents = (departmentId: number) => {
  return useQuery({
    // queryKey is like a unique ID for this data in the cache. 
    // If departmentId changes, it fetches new data.
    queryKey: ['incidents', 'department', departmentId],
    queryFn: () => incidentApi.getDepartmentIncidents(departmentId),
    // Don't fetch if departmentId is not valid (e.g., 0 or undefined)
    enabled: !!departmentId, 
  });
};

// 2. Hook to accept an incident
export const useAcceptIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incidentId: number) => incidentApi.acceptIncident(incidentId),
    // When successful, tell React Query to refresh the incidents list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// 3. Hook to reject an incident
export const useRejectIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // We pass an object because mutationFn only accepts one argument
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      incidentApi.rejectIncident(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// 4. Hook to review an incident
export const useReviewIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incidentId: number) => incidentApi.reviewIncident(incidentId),
    // When successful, tell React Query to refresh the incidents list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// 5. Hook to close an incident
export const useCloseIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incidentId: number) => incidentApi.closeIncident(incidentId),
    // When successful, tell React Query to refresh the incidents list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// 6. Hook to assign an investigator to an incident
export const useAssignInvestigator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // We pass an object because mutationFn only accepts one argument
    mutationFn: ({ id, investigatorId }: { id: number; investigatorId: number }) => 
      incidentApi.assignInvestigator(id, investigatorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// 7. Hook to assign an action owner to an incident
export const useAssignActionOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // We pass an object because mutationFn only accepts one argument
    mutationFn: ({ id, actionOwnerId }: { id: number; actionOwnerId: number }) => 
      incidentApi.assignActionOwner(id, actionOwnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

// 8. Hook to submit a new incident (Staff Submission)
export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => incidentApi.createIncident(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};

  