/**
 * Mapping of Department IDs to their respective names.
 * In a fully dynamic system, this would be fetched from a /api/departments endpoint.
 * For now, we use a constant map based on the 5 core hospital pillars.
 */
export const DEPARTMENT_MAP: Record<number, string> = {
  1: 'Finance',
  2: 'Human Resources',
  3: 'Operations',
  4: 'Clinical Services',
  5: 'Information Technology',
};

/**
 * Helper function to get the department name by ID
 */
export const getDepartmentName = (id?: number): string => {
  if (!id) return 'Unknown Department';
  return DEPARTMENT_MAP[id] || `Department ${id}`;
};
