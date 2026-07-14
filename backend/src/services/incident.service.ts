import { incidentRepository } from '../repositories/incident.repository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class IncidentService {
  
  /**
   * Get all incidents for a specific department
   * @param departmentId - The ID of the manager's department
   * @returns Array of incidents
   */
  async getIncidentsByDepartment(departmentId: number) {
    
    // 1. Business Logic / Validations can go here.
    // උදාහරණයක් ලෙස: මෙතනදී අපිට පුළුවන් departmentId එක 0 ට වඩා වැඩිද (valid ද) කියලා බලන්න.
    if (!departmentId || departmentId <= 0) {
        throw new Error("Invalid Department ID provided"); 
        // Note: පසුව අපි මේක Custom API Error (උදා: AppError) එකක් විදියට Refactor කරනවා.
    }

    // 2. Calling the Repository layer to get data
    const incidents = await incidentRepository.findByDepartmentId(departmentId);

    // 3. Formatting or modifying data before sending to the controller can happen here
    // For now, we just return the data as it is.
    return incidents;
  }

  /**
   * Accept an OPEN incident
   * @param incidentId - The ID of the incident to accept
   * @returns The updated incident
   */
  async acceptIncident(incidentId: number) {
    
    // 1. Fetch the incident from the database
    const incident = await incidentRepository.findById(incidentId);

    // 2. Check if the incident exists
    if (!incident) {
      throw new Error("Incident not found.");
    }

    // 3. State Validation (Business Logic)
    // An incident can only be accepted if it is currently in the 'OPEN' state.
    if (incident.status !== 'OPEN') {
      throw new Error(`Cannot accept incident. Current status is ${incident.status}, but expected OPEN.`);
    }

    // 4. Update the status to 'ACCEPTED' via Repository
    const updatedIncident = await incidentRepository.updateStatus(incidentId, 'ACCEPTED');

    return updatedIncident;
  }

  /**
   * Reject an OPEN incident with a reason
   * @param incidentId - The ID of the incident to reject
   * @param reason - The mandatory reason for rejection
   * @returns The updated incident
   */
  async rejectIncident(incidentId: number, reason: string) {
    
    // 1. Fetch the incident from the database
    const incident = await incidentRepository.findById(incidentId);

    // 2. Check if the incident exists
    if (!incident) {
      throw new Error("Incident not found.");
    }

    // 3. State Validation (Business Logic)
    // An incident can only be rejected if it is currently in the 'OPEN' state.
    if (incident.status !== 'OPEN') {
      throw new Error(`Cannot reject incident. Current status is ${incident.status}, but expected OPEN.`);
    }

    // 4. Update the status to 'REJECTED' and save the reason via Repository
    const updatedIncident = await incidentRepository.rejectIncident(incidentId, reason);

    return updatedIncident;
  }

  /**
   * Assign an investigator to an ACCEPTED incident
   * @param incidentId - The ID of the incident
   * @param investigatorId - The ID of the user to be assigned
   * @returns The updated incident
   */
  async assignInvestigator(incidentId: number, investigatorId: number) {
    
    // 1. Fetch the incident
    const incident = await incidentRepository.findById(incidentId);
    if (!incident) {
      throw new Error("Incident not found.");
    }

    // 2. State Validation: Must be 'ACCEPTED'
    if (incident.status !== 'ACCEPTED') {
      throw new Error(`Cannot assign investigator. Current status is ${incident.status}, but expected ACCEPTED.`);
    }

    // 3. Fetch the user (Investigator)
    // Note: Ideally, this should go through a UserRepository. We will refactor this later.
    const investigator = await prisma.user.findUnique({
      where: { id: investigatorId }
    });

    if (!investigator) {
      throw new Error("The specified investigator does not exist.");
    }

    // 4. RBAC Validation: Check if the user has the correct role
    if (investigator.role !== 'INVESTIGATOR' && investigator.role !== 'MANAGER') {
      throw new Error("The specified user does not have the required role to be an investigator.");
    }

    // 5. Update the incident via Repository
    const updatedIncident = await incidentRepository.assignInvestigator(incidentId, investigatorId);

    return updatedIncident;
  }


  /**
   * Assign Action Owner to an ACCEPTED incident
   * @param id - The ID of the incident
   * @param actionOwnerId - The ID of the user assigned to own the action
   * @returns The updated incident
   */
  async assignActionOwner(incidentId: number, actionOwnerId: number) {
    
    // 1. Fetch the incident
    const incident = await incidentRepository.findById(incidentId);
    if (!incident) {
      throw new Error("Incident not found.");
    }

    // 2. State Validation: Must be 'INVESTIGATING'
    if (incident.status !== 'INVESTIGATING') {
      throw new Error(`Cannot assign action owner. Current status is ${incident.status}, but expected INVESTIGATING.`);
    }

    // 3. Fetch the user (Action Owner)
    // Note: Ideally, this should go through a UserRepository. We will refactor this later.
    const actionOwner = await prisma.user.findUnique({
      where: { id: actionOwnerId }
    });

    if (!actionOwner) {
      throw new Error("The specified action owner does not exist.");
    }

    // 4. RBAC Validation: Check if the user has the correct role
    if (actionOwner.role !== 'ACTION_OWNER' && actionOwner.role !== 'MANAGER') {
      throw new Error("The specified user does not have the required role to be an action owner.");
    }

    // 5. Update the incident via Repository
    const updatedIncident = await incidentRepository.assignInvestigator(incidentId, investigatorId);

    return updatedIncident;
  }

}

// Export a single instance of the service (Singleton pattern approach for now)
export const incidentService = new IncidentService();