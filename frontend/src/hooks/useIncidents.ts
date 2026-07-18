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