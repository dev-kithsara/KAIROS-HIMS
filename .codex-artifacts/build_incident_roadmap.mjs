import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:/KAIROS-HIMS/outputs/ai-incident-management-six-month-plan";
const previewDir = "C:/KAIROS-HIMS/.codex-artifacts/previews";
const outputPath = path.join(outputDir, "AI_Incident_Management_6_Month_Roadmap.xlsx");

const workbook = Workbook.create();
const fontFamily = "Arial";

const owners = ["Kasun", "Kithsara", "Chandupa"];
const priorities = ["Critical", "High", "Medium", "Low"];
const statuses = ["Not Started", "In Progress", "Blocked", "In Review", "Completed"];
const changeTypes = ["Modify Existing", "New Feature", "Bug Fix", "Research and Design", "Testing and Documentation"];

const d = (value) => new Date(`${value}T00:00:00Z`);
const task = (taskName, assignedTo, priority, startDate, endDate, phase, changeType, aiIntegration, acceptanceCriteria, dependencies = "None", notes = "") => ({
  taskName,
  assignedTo,
  priority,
  startDate: d(startDate),
  endDate: d(endDate),
  timeSpent: null,
  status: "Not Started",
  phase,
  changeType,
  aiIntegration,
  acceptanceCriteria,
  dependencies,
  notes,
});

const rolePlans = {
  "Admin": [
    task("Finalize the role and permission matrix for all five system roles", "Kasun", "Critical", "2026-10-01", "2026-10-07", "Month 1 - Foundation", "Research and Design", "Defines secure access boundaries for every AI feature", "The approved matrix covers create, read, update, workflow, analytics, and AI permissions for each role."),
    task("Replace free-text user roles with a validated Role enum", "Kithsara", "Critical", "2026-10-05", "2026-10-12", "Month 1 - Foundation", "Modify Existing", "Prevents unauthorized access to AI insights and model controls", "The database, API validation, seed data, and frontend types use ADMIN, MANAGER, INVESTIGATOR, ACTION_OWNER, and STAFF."),
    task("Add Admin access to protected frontend routes and navigation", "Chandupa", "Critical", "2026-10-08", "2026-10-16", "Month 1 - Foundation", "Bug Fix", "Provides access to the Admin AI governance dashboard", "An ADMIN user can sign in and reach the Admin workspace without redirection or permission errors.", "Role enum task"),
    task("Implement Admin authorization override across protected APIs", "Kasun", "Critical", "2026-10-12", "2026-10-23", "Month 1 - Foundation", "New Feature", "Allows authorized cross-department AI oversight", "Admin can perform permitted operations across all departments while every action is audited.", "Role and permission matrix"),
    task("Build the cross-department incident oversight dashboard", "Chandupa", "High", "2026-10-19", "2026-11-06", "Months 1-2 - Core Platform", "New Feature", "Displays enterprise risk trends and AI alerts by department", "Admin can filter incidents by department, severity, status, category, and date and open a permitted record.", "Admin API authorization"),
    task("Implement department management for create, update, deactivate, and view", "Kithsara", "High", "2026-11-02", "2026-11-13", "Month 2 - Core Platform", "New Feature", "Maintains clean department metadata for analytics models", "Admin can manage departments without deleting historical incident relationships."),
    task("Implement user management for create, update, deactivate, and role assignment", "Kasun", "High", "2026-11-09", "2026-11-20", "Month 2 - Core Platform", "Modify Existing", "Controls which users can access role-specific AI features", "Admin can manage user status, department, and role with validation and audit history."),
    task("Add controlled Admin incident correction with mandatory reason", "Kithsara", "High", "2026-11-16", "2026-11-27", "Month 2 - Core Platform", "New Feature", "Corrected records improve AI training data quality", "Admin corrections require a reason and preserve before-and-after values in the audit log.", "Audit log model"),
    task("Create the AuditLog data model and reusable audit service", "Kasun", "Critical", "2026-11-02", "2026-11-20", "Month 2 - Core Platform", "New Feature", "Tracks AI recommendations, overrides, and model decisions", "Authentication, role, incident, workflow, review, closure, and AI events record actor, time, action, entity, and changes."),
    task("Build the Admin audit log viewer with filters and export", "Chandupa", "High", "2026-11-23", "2026-12-04", "Months 2-3 - Governance", "New Feature", "Shows AI recommendation usage and human overrides", "Admin can search and export audit events by user, department, event type, entity, and date.", "Audit log service"),
    task("Define and implement sensitive-data masking rules", "Kithsara", "Critical", "2026-12-01", "2026-12-15", "Month 3 - Governance", "New Feature", "Prevents sensitive text from being exposed to unauthorized AI views", "Restricted fields are masked by role and are excluded from AI prompts unless explicitly authorized."),
    task("Secure evidence storage and authenticated file access", "Kasun", "Critical", "2026-12-07", "2026-12-18", "Month 3 - Governance", "Modify Existing", "Controls evidence supplied to AI summarization", "Files are stored outside public paths, checked for allowed type and size, and served only after incident authorization."),
    task("Build system configuration for categories, severity, SLAs, and workflow values", "Chandupa", "Medium", "2026-12-14", "2026-12-31", "Month 3 - Governance", "New Feature", "Provides governed labels and thresholds for AI and analytics", "Admin can update approved configuration values without code changes and changes are audited."),
    task("Build enterprise incident analytics across departments", "Kithsara", "High", "2027-01-04", "2027-01-22", "Month 4 - Analytics", "New Feature", "Shows organization-wide frequency, ageing, resolution, and risk concentration", "Dashboard metrics use live incident data and support department and date filters.", "Completed structured incident data"),
    task("Build the AI data-quality monitoring dashboard", "Kasun", "High", "2027-01-18", "2027-02-05", "Months 4-5 - AI", "New Feature", "Measures completeness and consistency before model use", "Admin sees missing-field rates, invalid values, class balance, and records excluded from model training.", "Seven-object data model"),
    task("Implement AI model registry and model-version metadata", "Kithsara", "High", "2027-02-01", "2027-02-12", "Month 5 - AI", "New Feature", "Tracks predictive-risk and similarity model versions", "Each model version records training date, dataset version, metrics, status, and deployment history."),
    task("Build AI model health, accuracy, and drift monitoring", "Chandupa", "High", "2027-02-08", "2027-02-19", "Month 5 - AI", "New Feature", "Alerts Admin when predictive performance or data patterns change", "The dashboard displays accuracy, drift indicators, failures, latency, and the active model version.", "AI model registry"),
    task("Implement model retraining approval and rollback workflow", "Kasun", "Medium", "2027-02-15", "2027-02-26", "Month 5 - AI", "New Feature", "Keeps model changes under human governance", "Admin can approve, reject, deploy, and roll back a model version with an audit trail.", "Model registry and health monitoring"),
    task("Run security and authorization penetration tests", "Kithsara", "Critical", "2027-03-01", "2027-03-12", "Month 6 - Validation", "Testing and Documentation", "Includes AI endpoints, prompt inputs, and model administration", "Automated and manual tests prove cross-role and cross-department access is denied unless explicitly permitted."),
    task("Run concurrency, performance, and availability tests", "Chandupa", "High", "2027-03-08", "2027-03-19", "Month 6 - Validation", "Testing and Documentation", "Measures AI endpoint latency separately from core workflow latency", "The agreed concurrent-user target is met and slow AI jobs do not block incident operations."),
    task("Implement backup, recovery, monitoring, and production deployment procedures", "Kasun", "High", "2027-03-15", "2027-03-26", "Month 6 - Deployment", "New Feature", "Includes AI artifacts, vector indexes, and model metadata", "A documented deployment, backup, restore, monitoring, and rollback exercise succeeds in the target environment."),
    task("Complete Admin UAT, training, and handover documentation", "Kithsara", "Medium", "2027-03-22", "2027-03-31", "Month 6 - Deployment", "Testing and Documentation", "Explains AI limitations, governance, and override responsibilities", "Admin stakeholders approve the workflows and receive operating and support documentation."),
  ],
  "Department Manager": [
    task("Enforce own-department access on every Manager incident API", "Kasun", "Critical", "2026-10-01", "2026-10-12", "Month 1 - Foundation", "Bug Fix", "Restricts department AI insights to authorized managers", "A Manager cannot read or modify an incident outside the department in the signed token."),
    task("Restrict investigator and action-owner assignment candidates to the Manager department", "Kithsara", "Critical", "2026-10-08", "2026-10-19", "Month 1 - Foundation", "Bug Fix", "Prevents cross-department AI recommendations and assignments", "Assignment APIs and dropdowns return only eligible active users in the Manager department."),
    task("Redesign the Manager dashboard around department risk and workflow queues", "Chandupa", "High", "2026-10-12", "2026-10-30", "Month 1 - Foundation", "Modify Existing", "Creates the home for role-specific AI risk insights", "Dashboard shows submitted, investigating, action overdue, review pending, high-risk, and closed counts from live data."),
    task("Add accept, reject, comment, and revision-request decisions", "Kasun", "Critical", "2026-10-19", "2026-11-06", "Months 1-2 - Core Workflow", "Modify Existing", "Stores manager feedback that can improve AI classification quality", "Manager can accept, reject, or request revision with mandatory comments and the reporter can view the decision."),
    task("Add controlled incident editing with validation and audit history", "Kithsara", "High", "2026-11-02", "2026-11-13", "Month 2 - Core Workflow", "New Feature", "Improves structured fields used by analytics and AI", "Manager can edit authorized incident details and every change is validated and audited."),
    task("Implement investigator assignment after acceptance", "Chandupa", "Critical", "2026-11-09", "2026-11-18", "Month 2 - Core Workflow", "Modify Existing", "Can later use workload-aware AI assignment suggestions", "Only accepted incidents can receive an eligible department investigator and the transition is audited."),
    task("Build Manager review of submitted investigation findings", "Kasun", "High", "2026-11-16", "2026-11-27", "Month 2 - Core Workflow", "New Feature", "Displays AI similarity evidence beside human investigation findings", "Manager can approve investigation findings or return them to the assigned investigator with comments."),
    task("Block Action Owner assignment until root-cause submission is approved", "Kithsara", "Critical", "2026-11-23", "2026-12-04", "Months 2-3 - Workflow Control", "Bug Fix", "Prevents AI action recommendations from using incomplete RCA", "The API rejects assignment until required investigation and root-cause fields are complete and approved."),
    task("Support assignment of one or more Action Owners to action items", "Chandupa", "High", "2026-12-01", "2026-12-11", "Month 3 - Workflow Control", "New Feature", "Enables AI monitoring per action and owner", "Manager can assign each action to an eligible owner and every owner sees only assigned actions."),
    task("Create multiple corrective and preventive action items", "Kasun", "Critical", "2026-12-01", "2026-12-18", "Month 3 - Workflow Control", "New Feature", "Provides structured action data for similarity and effectiveness models", "Manager can create multiple actions with type, priority, owner, due date, status, and description."),
    task("Add action priority, due-date, and escalation management", "Kithsara", "High", "2026-12-14", "2026-12-24", "Month 3 - Workflow Control", "New Feature", "Feeds overdue and completion-risk AI features", "Manager can change authorized action priorities and due dates with reason and notifications."),
    task("Build existing-control assessment and new-control planning", "Chandupa", "Critical", "2026-12-07", "2026-12-24", "Month 3 - Controls and Review", "New Feature", "Supplies control-effectiveness analytics and AI recommendations", "Manager can record control type, effectiveness, failure reason, required improvements, owner, date, and status."),
    task("Build management Review records with outcome and comments", "Kasun", "Critical", "2026-12-21", "2027-01-08", "Months 3-4 - Controls and Review", "New Feature", "Shows AI evidence without replacing the Manager decision", "Review captures reviewer, date, outcome, comments, lessons learned, dissemination, and follow-up details."),
    task("Add lessons-learned dissemination and follow-up scheduling", "Kithsara", "Medium", "2027-01-04", "2027-01-15", "Month 4 - Analytics", "New Feature", "Populates the AI-categorized lessons library", "Manager can select audiences, schedule follow-up, and track dissemination status."),
    task("Enforce closure prerequisites and create a structured closure record", "Chandupa", "Critical", "2027-01-04", "2027-01-22", "Month 4 - Analytics", "Modify Existing", "Creates reliable labels for resolution-time and severity models", "Close is allowed only after all actions are completed, controls are verified, and review is approved."),
    task("Add controlled incident reopen workflow", "Kasun", "Medium", "2027-01-18", "2027-01-29", "Month 4 - Analytics", "New Feature", "Tracks recurrence outcomes for AI evaluation", "Authorized Manager can reopen a closed incident with reason while preserving closure history."),
    task("Upgrade the incident register with server-side search, filters, sorting, and pagination", "Kithsara", "High", "2027-01-11", "2027-01-29", "Month 4 - Analytics", "Modify Existing", "Supports filtered AI and analytical investigation", "Register supports ID, title, category, severity, status, location, date, reporter, and owner filters at scale."),
    task("Add authorized CSV and report export", "Chandupa", "Medium", "2027-01-25", "2027-02-05", "Months 4-5 - Analytics", "Modify Existing", "Exports AI scores with model version and explanation", "Export respects department access and clearly labels calculated and AI-derived fields."),
    task("Build the Incident Frequency Trends widget", "Kasun", "High", "2027-01-18", "2027-02-05", "Months 4-5 - Analytics", "New Feature", "Uses time-series statistics and anomaly detection", "Manager can view daily, weekly, monthly, and quarterly trends filtered by category, severity, and location."),
    task("Build the Root Cause Distribution widget", "Kithsara", "High", "2027-01-25", "2027-02-12", "Months 4-5 - Analytics", "New Feature", "Highlights frequent and emerging root-cause patterns", "Widget provides category and sub-category drill-down using approved root-cause data."),
    task("Build the Control Effectiveness Heatmap", "Chandupa", "High", "2027-02-01", "2027-02-16", "Month 5 - AI", "New Feature", "Finds repeatedly ineffective control types", "Heatmap compares control type, effectiveness, department context, and incident frequency."),
    task("Build Time to Resolution analytics", "Kasun", "High", "2027-02-01", "2027-02-16", "Month 5 - AI", "New Feature", "Detects resolution-time outliers and bottlenecks", "Manager can compare average and outlier resolution times by severity, category, and team."),
    task("Build Overdue Actions and Open Incident Ageing widgets", "Kithsara", "High", "2027-02-08", "2027-02-19", "Month 5 - AI", "New Feature", "Uses SLA rules and due-date risk indicators", "Widgets show ageing and overdue items by owner, priority, severity, and SLA threshold."),
    task("Integrate Predictive Risk Scoring with explanation and human override", "Chandupa", "High", "2027-02-15", "2027-03-05", "Months 5-6 - AI", "New Feature", "Predicts escalation, recurrence, and prolonged resolution", "Each score shows model version, key factors, confidence context, and a recorded Manager override option.", "Minimum viable historical dataset and model registry"),
    task("Build the Severity Accuracy Tracker", "Kasun", "Medium", "2027-02-22", "2027-03-05", "Months 5-6 - AI", "New Feature", "Compares initial and final severity to improve triage", "Manager can view over-rating and under-rating patterns over time by category and department."),
    task("Show AI-recommended similar incidents, lessons, controls, and actions", "Kithsara", "High", "2027-02-22", "2027-03-12", "Months 5-6 - AI", "New Feature", "Provides contextual recommendations during review", "Recommendations include relevance scores, source links, model version, and an option to accept or dismiss."),
    task("Create Manager workflow integration and regression tests", "Chandupa", "Critical", "2027-03-01", "2027-03-19", "Month 6 - Validation", "Testing and Documentation", "Tests permissions and AI-assisted decision paths", "Automated tests cover valid and invalid state transitions, department boundaries, closure guards, and AI failures."),
    task("Complete Department Manager UAT and workflow documentation", "Kasun", "High", "2027-03-15", "2027-03-31", "Month 6 - Deployment", "Testing and Documentation", "Documents AI interpretation and human accountability", "Managers approve the end-to-end lifecycle and receive role-specific operating guidance."),
  ],
  "Investigator": [
    task("Enforce assigned-investigator ownership on every investigation API", "Kasun", "Critical", "2026-10-01", "2026-10-12", "Month 1 - Foundation", "Bug Fix", "Protects investigation data and role-specific AI results", "An Investigator can read or update only incidents assigned to the signed-in user."),
    task("Create the structured Investigation data model and migration", "Kithsara", "Critical", "2026-10-08", "2026-10-23", "Month 1 - Foundation", "New Feature", "Creates reliable investigation features for AI analysis", "The model supports lead, team, dates, method, findings, factors, witnesses, evidence, and timeline."),
    task("Build the investigation workspace with save-draft capability", "Chandupa", "High", "2026-10-19", "2026-11-06", "Months 1-2 - Investigation", "Modify Existing", "Provides the interface for AI-assisted investigation", "Assigned Investigator can save incomplete work without advancing the incident state."),
    task("Add investigation team member management", "Kasun", "Medium", "2026-11-02", "2026-11-13", "Month 2 - Investigation", "New Feature", "Allows collaboration context for AI and audit records", "Lead Investigator can add eligible team members while access remains controlled."),
    task("Add investigation start date, end date, and method fields", "Kithsara", "High", "2026-11-09", "2026-11-20", "Month 2 - Investigation", "New Feature", "Supports duration analytics and method recommendations", "Dates and approved methods are validated and included in the investigation record."),
    task("Add findings summary and contributing factors", "Chandupa", "High", "2026-11-16", "2026-11-27", "Month 2 - Investigation", "New Feature", "Supplies structured data for clustering and prediction", "Investigator can record validated findings and multiple approved contributing factors."),
    task("Add witness records, evidence references, and timeline of events", "Kasun", "High", "2026-11-23", "2026-12-11", "Months 2-3 - Investigation", "New Feature", "Provides source material for AI timeline and evidence summarization", "Investigator can add authorized witness references, files, and chronological events."),
    task("Create the complete Root Cause Analysis data model", "Kithsara", "Critical", "2026-12-01", "2026-12-18", "Month 3 - Root Cause", "Modify Existing", "Creates structured training data for root-cause similarity", "Root cause stores category, sub-category, description, analysis method, and analysis detail."),
    task("Add systemic-issue flag and linked-incident relationships", "Chandupa", "High", "2026-12-14", "2026-12-24", "Month 3 - Root Cause", "New Feature", "Enables recurrence detection and incident graph analysis", "Investigator can flag systemic issues and link authorized related incidents with reasons."),
    task("Implement investigation submission and Manager return-for-revision workflow", "Kasun", "Critical", "2026-12-21", "2027-01-08", "Months 3-4 - Workflow", "New Feature", "Records human approval around AI-assisted findings", "Submission validates required fields, locks approved findings, and supports revision comments and resubmission."),
    task("Upgrade the Investigator dashboard with status, priority, and due-date filters", "Kithsara", "Medium", "2027-01-04", "2027-01-15", "Month 4 - Analytics", "Modify Existing", "Prioritizes cases using permitted risk signals", "Dashboard lists only assigned work and supports search, status, severity, and due-date filters."),
    task("Build Similar Incidents search using text embeddings", "Chandupa", "High", "2027-01-18", "2027-02-05", "Months 4-5 - AI", "New Feature", "Ranks historical incidents by description, category, location, and root cause", "Investigator receives a ranked list with similarity score, matched fields, and authorized source links.", "Clean historical lifecycle data"),
    task("Add a similar-root-cause comparison panel", "Kasun", "High", "2027-01-25", "2027-02-12", "Months 4-5 - AI", "New Feature", "Surfaces repeated root causes and previous analysis methods", "Panel compares root-cause categories, descriptions, methods, controls, and outcomes."),
    task("Build the Incident Clustering Map", "Kithsara", "High", "2027-02-01", "2027-02-19", "Month 5 - AI", "New Feature", "Groups incidents by latent category, location, and root-cause patterns", "Investigator can inspect clusters and open permitted incidents without exposing restricted data."),
    task("Add AI-assisted evidence and timeline summarization", "Chandupa", "Medium", "2027-02-08", "2027-02-23", "Month 5 - AI", "New Feature", "Summarizes authorized evidence metadata and event chronology", "Generated summary is clearly labeled, source-linked, editable, and never overwrites Investigator findings."),
    task("Add AI suggestions for investigation method and contributing factors", "Kasun", "Medium", "2027-02-15", "2027-02-26", "Month 5 - AI", "New Feature", "Suggests methods such as 5 Whys, Fishbone, Fault Tree, or Timeline Analysis", "Suggestions show reasons and require explicit Investigator selection or dismissal."),
    task("Add explainability, feedback, and human-override capture for Investigator AI", "Kithsara", "High", "2027-02-22", "2027-03-05", "Months 5-6 - AI", "New Feature", "Collects relevance feedback for improving similarity and recommendation quality", "Every AI result shows explanation and model version and records accept, dismiss, or override feedback."),
    task("Create Investigator unit, authorization, and workflow tests", "Chandupa", "Critical", "2027-03-01", "2027-03-15", "Month 6 - Validation", "Testing and Documentation", "Covers AI failure and fallback behavior", "Tests cover ownership, drafts, submissions, revisions, file access, similarity access, and invalid state transitions."),
    task("Run AI relevance evaluation with a reviewed incident sample", "Kasun", "High", "2027-03-08", "2027-03-19", "Month 6 - Validation", "Testing and Documentation", "Measures Similar Incidents and recommendation usefulness", "Evaluation records precision-oriented relevance results, reviewer feedback, and known limitations."),
    task("Complete Investigator UAT, training, and role documentation", "Kithsara", "Medium", "2027-03-15", "2027-03-31", "Month 6 - Deployment", "Testing and Documentation", "Explains responsible use of AI suggestions", "Investigators approve the workflow and receive investigation, privacy, and AI-use guidance."),
  ],
  "Action Owner": [
    task("Enforce assigned-action ownership on every Action Owner API", "Kasun", "Critical", "2026-10-01", "2026-10-12", "Month 1 - Foundation", "Bug Fix", "Restricts action-related AI suggestions to the assigned owner", "An Action Owner can read and update only explicitly assigned action items."),
    task("Create the multiple-action data model and migration", "Kithsara", "Critical", "2026-10-08", "2026-10-23", "Month 1 - Foundation", "New Feature", "Provides structured action data for similarity and effectiveness models", "Each incident supports multiple action records with unique IDs and relationships."),
    task("Add action description, type, priority, owner, and due date", "Chandupa", "Critical", "2026-10-19", "2026-11-06", "Months 1-2 - Actions", "Modify Existing", "Creates features for overdue and risk prediction", "Every action validates Immediate, Corrective, or Preventive type, priority, owner, and due date."),
    task("Build the Action Owner dashboard for assigned work", "Kasun", "High", "2026-11-02", "2026-11-16", "Month 2 - Actions", "Modify Existing", "Shows AI-ranked urgency and due-date risk", "Dashboard displays only assigned actions with incident context, priority, due date, status, and search filters."),
    task("Build action detail and progress-update screens", "Kithsara", "High", "2026-11-09", "2026-11-23", "Month 2 - Actions", "New Feature", "Displays relevant AI recommendations beside the action", "Owner can update Not Started, In Progress, and Completed states with required notes."),
    task("Add completion date and automatic overdue-state calculation", "Chandupa", "High", "2026-11-16", "2026-11-27", "Month 2 - Actions", "New Feature", "Feeds overdue analytics and completion-risk models", "Completion date is captured and overdue state derives from due date and status."),
    task("Add action evidence attachments and secure viewing", "Kasun", "High", "2026-11-23", "2026-12-04", "Months 2-3 - Actions", "New Feature", "Provides evidence metadata for AI effectiveness review", "Owner can upload approved files and authorized reviewers can view them securely."),
    task("Add verification notes and action-effectiveness assessment", "Kithsara", "Critical", "2026-12-01", "2026-12-15", "Month 3 - Actions", "New Feature", "Creates labels for action-effectiveness analytics", "Completion requires verification notes and supports Manager-verified effectiveness status."),
    task("Prevent incident review until all required actions are completed", "Chandupa", "Critical", "2026-12-07", "2026-12-18", "Month 3 - Workflow Control", "Bug Fix", "Prevents incomplete action data from reaching AI closure analysis", "The API rejects review while any required action is incomplete or unverified."),
    task("Add action-return and revision workflow", "Kasun", "High", "2026-12-14", "2026-12-24", "Month 3 - Workflow Control", "New Feature", "Records reasons when AI or Manager review finds insufficient action", "Manager can return an action with comments and owner can revise and resubmit."),
    task("Implement overdue and escalation notifications", "Kithsara", "High", "2027-01-04", "2027-01-15", "Month 4 - Analytics", "New Feature", "Uses SLA and predicted completion risk", "Owner receives in-app notifications before due date and when an action becomes overdue."),
    task("Build action history and audit timeline", "Chandupa", "Medium", "2027-01-11", "2027-01-22", "Month 4 - Analytics", "New Feature", "Shows AI suggestions and owner decisions over time", "Action page shows status, assignment, date, evidence, review, and recommendation events in order."),
    task("Build Similar Actions Analysis using embeddings and clustering", "Kasun", "High", "2027-01-18", "2027-02-05", "Months 4-5 - AI", "New Feature", "Finds repeated corrective measures across incidents", "Owner sees authorized similar actions, completion rates, effectiveness, and relevance scores.", "Multiple structured action records"),
    task("Highlight recurring fixes with poor effectiveness", "Kithsara", "High", "2027-01-25", "2027-02-12", "Months 4-5 - AI", "New Feature", "Signals when repeated actions are not preventing recurrence", "The system identifies repeated low-effectiveness actions and explains the supporting history."),
    task("Add AI recommendations for effective actions and controls", "Chandupa", "High", "2027-02-01", "2027-02-19", "Month 5 - AI", "New Feature", "Suggests actions and controls from relevant successful incidents", "Recommendations include source incidents, effectiveness evidence, and accept or dismiss feedback."),
    task("Add due-date completion-risk prediction", "Kasun", "Medium", "2027-02-08", "2027-02-23", "Month 5 - AI", "New Feature", "Predicts actions likely to miss their due dates", "Risk indicator includes factors, model version, and no automatic status change."),
    task("Build Action Effectiveness scoring and outcome feedback", "Kithsara", "High", "2027-02-15", "2027-03-05", "Months 5-6 - AI", "New Feature", "Combines verification, recurrence, timeliness, and review outcomes", "Score is explainable, Manager-reviewed, and linked to the supporting data."),
    task("Create Action Owner unit, authorization, and workflow tests", "Chandupa", "Critical", "2027-03-01", "2027-03-15", "Month 6 - Validation", "Testing and Documentation", "Covers AI failure and recommendation fallback behavior", "Tests cover ownership, progress, overdue logic, evidence, completion guards, revisions, and AI result access."),
    task("Run usability and AI recommendation feedback sessions", "Kasun", "Medium", "2027-03-08", "2027-03-19", "Month 6 - Validation", "Testing and Documentation", "Measures whether recommendations help owners complete effective actions", "Feedback is recorded, prioritized, and used to adjust the final workflow."),
    task("Complete Action Owner UAT, training, and role documentation", "Kithsara", "Medium", "2027-03-15", "2027-03-31", "Month 6 - Deployment", "Testing and Documentation", "Explains AI suggestions, due-date risk, and human accountability", "Action Owners approve the workflow and receive operating guidance."),
  ],
  "Staff": [
    task("Create an authenticated API that returns only incidents reported by the signed-in Staff user", "Kasun", "Critical", "2026-10-01", "2026-10-12", "Month 1 - Foundation", "New Feature", "Restricts staff AI suggestions and history to owned incidents", "Staff cannot list or open incidents reported by another user."),
    task("Replace the static My Incidents page with live data", "Kithsara", "Critical", "2026-10-08", "2026-10-23", "Month 1 - Foundation", "Bug Fix", "Shows AI-assisted status explanations only for owned incidents", "Counts and incident cards load from the own-incidents API and support loading, empty, and error states."),
    task("Fix the broken Staff report navigation route", "Chandupa", "Critical", "2026-10-01", "2026-10-07", "Month 1 - Foundation", "Bug Fix", "Restores access to the future AI-assisted report form", "The Staff navigation opens the configured incident submission route."),
    task("Add formatted Incident ID, incident occurrence date and time, and reported date", "Kasun", "High", "2026-10-19", "2026-11-06", "Months 1-2 - Incident Details", "Modify Existing", "Improves time-series and resolution-time analytics", "New incidents receive a unique human-readable ID and valid occurrence and report timestamps."),
    task("Add dependent category and sub-category fields", "Kithsara", "High", "2026-11-02", "2026-11-13", "Month 2 - Incident Details", "New Feature", "Supports AI classification and consistent analytics", "Sub-category choices depend on the selected approved category and both values are stored."),
    task("Validate department selection and incident routing", "Chandupa", "High", "2026-11-09", "2026-11-20", "Month 2 - Incident Details", "Modify Existing", "Routes the report to the correct department AI and Manager queues", "Only active departments can be selected and the receiving Manager queue is correct."),
    task("Add save-draft, submit, and submission confirmation workflow", "Kasun", "Medium", "2026-11-16", "2026-11-27", "Month 2 - Incident Details", "New Feature", "Allows AI completeness guidance before final submission", "Staff can save a private draft, submit it once required fields are complete, and receive a reference ID."),
    task("Improve evidence upload, preview, removal, and authorized viewing", "Kithsara", "High", "2026-11-23", "2026-12-11", "Months 2-3 - Evidence", "Modify Existing", "Provides safe source material for optional AI summarization", "Allowed files can be previewed or removed before submission and viewed after authorization."),
    task("Show rejection comments and revision requests", "Chandupa", "High", "2026-12-01", "2026-12-11", "Month 3 - Revision Workflow", "New Feature", "Explains missing information identified by Manager or AI completeness checks", "Staff sees decision type, comments, date, and required revisions on the owned incident."),
    task("Allow controlled editing and resubmission after a revision request", "Kasun", "Critical", "2026-12-07", "2026-12-18", "Month 3 - Revision Workflow", "New Feature", "Captures improved structured data without losing the original report", "Only revision-requested fields are editable and resubmission preserves version history."),
    task("Add incident status timeline and in-app notifications", "Kithsara", "Medium", "2026-12-14", "2026-12-24", "Month 3 - Revision Workflow", "New Feature", "Explains major workflow and AI-assisted triage events", "Staff sees submitted, decision, investigation, action, review, and closure milestones without restricted details."),
    task("Add search and filters to My Incidents", "Chandupa", "Medium", "2027-01-04", "2027-01-15", "Month 4 - Analytics", "New Feature", "Helps users find previous reports and AI suggestions", "Staff can search owned incidents and filter by status, severity, category, and date."),
    task("Add AI-assisted category and sub-category suggestions", "Kasun", "High", "2027-01-18", "2027-02-05", "Months 4-5 - AI", "New Feature", "Uses report text to recommend classifications", "Suggestions include a reason and require Staff confirmation or correction before submission.", "Approved category taxonomy and training data"),
    task("Add AI-assisted initial severity suggestion with human confirmation", "Kithsara", "High", "2027-01-25", "2027-02-12", "Months 4-5 - AI", "New Feature", "Predicts a starting severity from historical records", "Suggested severity is clearly labeled, explainable, editable, and never automatically final."),
    task("Show possible duplicate or similar incidents before submission", "Chandupa", "Medium", "2027-02-01", "2027-02-16", "Month 5 - AI", "New Feature", "Uses text similarity to reduce duplicate reports while preserving valid reporting", "Staff sees a limited, privacy-safe similarity notice and can continue submission with a reason."),
    task("Add an AI completeness assistant for missing or unclear report details", "Kasun", "High", "2027-02-08", "2027-02-23", "Month 5 - AI", "New Feature", "Checks required context before submission", "Assistant identifies missing date, location, chronology, category, or evidence context without inventing facts."),
    task("Add editable AI-generated incident summary", "Kithsara", "Medium", "2027-02-15", "2027-03-05", "Months 5-6 - AI", "New Feature", "Creates a concise title and summary from Staff-entered text", "Generated text is labeled, editable, and stored only after explicit Staff confirmation."),
    task("Complete responsive design, accessibility, and keyboard navigation", "Chandupa", "High", "2027-02-22", "2027-03-12", "Months 5-6 - Quality", "Modify Existing", "Ensures AI suggestions and explanations are accessible", "Staff workflows pass agreed responsive, contrast, label, focus, and keyboard checks."),
    task("Create Staff authorization, form, revision, and AI-assistance tests", "Kasun", "Critical", "2027-03-01", "2027-03-19", "Month 6 - Validation", "Testing and Documentation", "Tests safe fallback when AI services are unavailable", "Tests prove own-only access, validation, attachments, revisions, suggestions, overrides, and core submission without AI."),
    task("Complete Staff UAT, training, and user guidance", "Kithsara", "Medium", "2027-03-15", "2027-03-31", "Month 6 - Deployment", "Testing and Documentation", "Explains that AI suggestions support but do not replace user judgment", "Staff participants approve the reporting and tracking workflow and receive concise guidance."),
  ],
};

const overview = workbook.worksheets.add("Project Overview");
const roleNames = Object.keys(rolePlans);
for (const roleName of roleNames) workbook.worksheets.add(roleName);

overview.showGridLines = false;
overview.tabColor = "#1E2B5E";
overview.getRange("A2:H2").merge();
overview.getRange("A2").values = [["AI Incident Management Dashboard - Six-Month Delivery Roadmap"]];
overview.getRange("A2").format.font = { name: fontFamily, size: 16, bold: true, color: "#1E2B5E" };
overview.getRange("A3:H3").merge();
overview.getRange("A3").values = [["Planned period: 2026-10-01 to 2027-03-31 | Editable role-based implementation plan"]];
overview.getRange("A3").format.font = { name: fontFamily, size: 10, italic: true, color: "#6B7494" };
overview.getRange("A3:H3").format.borders = { bottom: { style: "thin", color: "#AAB4C8" } };

overview.getRange("A5:H5").values = [["Role", "Total Tasks", "Critical", "High", "Completed", "In Progress", "Blocked", "Completion"]];
overview.getRange("A5:H5").format = {
  fill: "#1E2B5E",
  font: { name: fontFamily, size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "inside", style: "thin", color: "#FFFFFF" },
};

roleNames.forEach((roleName, index) => {
  const row = 6 + index;
  const escaped = `'${roleName.replaceAll("'", "''")}'`;
  overview.getRange(`A${row}`).values = [[roleName]];
  overview.getRange(`B${row}:H${row}`).formulas = [[
    `=COUNTA(${escaped}!$A$5:$A$200)`,
    `=COUNTIF(${escaped}!$C$5:$C$200,"Critical")`,
    `=COUNTIF(${escaped}!$C$5:$C$200,"High")`,
    `=COUNTIF(${escaped}!$G$5:$G$200,"Completed")`,
    `=COUNTIF(${escaped}!$G$5:$G$200,"In Progress")`,
    `=COUNTIF(${escaped}!$G$5:$G$200,"Blocked")`,
    `=IF(B${row}=0,0,E${row}/B${row})`,
  ]];
});

const totalRow = 6 + roleNames.length;
overview.getRange(`A${totalRow}:H${totalRow}`).values = [["Overall", null, null, null, null, null, null, null]];
overview.getRange(`B${totalRow}:G${totalRow}`).formulas = [[
  `=SUM(B6:B${totalRow - 1})`, `=SUM(C6:C${totalRow - 1})`, `=SUM(D6:D${totalRow - 1})`,
  `=SUM(E6:E${totalRow - 1})`, `=SUM(F6:F${totalRow - 1})`, `=SUM(G6:G${totalRow - 1})`,
]];
overview.getRange(`H${totalRow}`).formulas = [[`=IF(B${totalRow}=0,0,E${totalRow}/B${totalRow})`]];
overview.getRange(`A${totalRow}:H${totalRow}`).format = {
  fill: "#E8ECF5",
  font: { name: fontFamily, size: 10, bold: true, color: "#1A2447" },
  borders: { top: { style: "double", color: "#1E2B5E" } },
};
overview.getRange(`H6:H${totalRow}`).format.numberFormat = "0%";
overview.getRange(`A6:H${totalRow}`).format.font = { name: fontFamily, size: 10, color: "#1A2447" };
overview.getRange(`B6:H${totalRow}`).format.horizontalAlignment = "center";

overview.getRange("A14:D14").merge();
overview.getRange("A14").values = [["Delivery Milestones"]];
overview.getRange("A14:D14").format = { fill: "#DCE5F7", font: { name: fontFamily, size: 11, bold: true, color: "#1E2B5E" }, borders: { preset: "outside", style: "thin", color: "#9FB0D0" } };
overview.getRange("A15:D15").values = [["Month", "Period", "Primary Outcome", "Exit Criteria"]];
overview.getRange("A15:D15").format = { fill: "#2952C4", font: { name: fontFamily, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
overview.getRange("A16:D21").values = [
  ["Month 1", "Oct 2026", "Security, RBAC, department scope, role access", "Cross-role and cross-department authorization tests pass"],
  ["Month 2", "Nov 2026", "Core Details, Investigation, and Actions data structures", "Structured records persist and workflow assignment is enforced"],
  ["Month 3", "Dec 2026", "Controls, Review, Closure, audit, and revision workflow", "No lifecycle stage can be bypassed"],
  ["Month 4", "Jan 2027", "Operational analytics and clean AI-ready dataset", "Live non-AI widgets reconcile with incident records"],
  ["Month 5", "Feb 2027", "Role-specific AI features and governance", "AI results are explainable, permission-scoped, and optional"],
  ["Month 6", "Mar 2027", "Testing, UAT, performance, deployment, and handover", "Stakeholders approve the system and deployment checks pass"],
];
overview.getRange("A16:D21").format = { font: { name: fontFamily, size: 10, color: "#1A2447" }, wrapText: true, verticalAlignment: "top", borders: { insideHorizontal: { style: "thin", color: "#D8DCE8" } } };

overview.getRange("A24:C24").merge();
overview.getRange("A24").values = [["Role-Specific AI Scope"]];
overview.getRange("A24:C24").format = { fill: "#DCE5F7", font: { name: fontFamily, size: 11, bold: true, color: "#1E2B5E" }, borders: { preset: "outside", style: "thin", color: "#9FB0D0" } };
overview.getRange("A25:C25").values = [["Role", "AI Capabilities", "Human Control"]];
overview.getRange("A25:C25").format = { fill: "#2952C4", font: { name: fontFamily, size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
overview.getRange("A26:C30").values = [
  ["Admin", "Data-quality monitoring, model registry, drift monitoring, retraining governance, enterprise risk", "Approves model deployment and rollback"],
  ["Department Manager", "Predictive risk, trend anomalies, ageing, overdue actions, severity accuracy, recommendations", "Reviews explanations and may override recommendations"],
  ["Investigator", "Similar incidents, root-cause similarity, clustering, evidence summaries, method suggestions", "Confirms, edits, or dismisses all AI outputs"],
  ["Action Owner", "Similar actions, effective-action recommendations, due-date risk, effectiveness scoring", "Chooses actions and provides outcome evidence"],
  ["Staff", "Category and severity suggestions, duplicate warning, completeness assistant, editable summary", "Confirms or corrects every suggestion before submission"],
];
overview.getRange("A26:C30").format = { font: { name: fontFamily, size: 10, color: "#1A2447" }, wrapText: true, verticalAlignment: "top", borders: { insideHorizontal: { style: "thin", color: "#D8DCE8" } } };

overview.getRange("A33:B33").values = [["Planning Basis", "Sources Reviewed"]];
overview.getRange("A33:B33").format = { fill: "#1E2B5E", font: { name: fontFamily, size: 10, bold: true, color: "#FFFFFF" } };
overview.getRange("A34:B36").values = [
  ["Mentor project briefing", "AI-Powered Incident Management Dashboard Project Briefing, Version 1.0, May 2026"],
  ["Mentor workflow", "Admin, Department Manager, Investigator, Action Owner, Staff, and the specified incident lifecycle"],
  ["Current implementation", "KAIROS-HIMS repository review: Prisma schema, Express APIs, React routes, role dashboards, analytics, and tests"],
];
overview.getRange("A34:B36").format = { font: { name: fontFamily, size: 10, color: "#1A2447" }, wrapText: true, verticalAlignment: "top", borders: { insideHorizontal: { style: "thin", color: "#D8DCE8" } } };

overview.getRange("A1:H40").format.font.name = fontFamily;
overview.getRange("A:A").format.columnWidth = 24;
overview.getRange("B:B").format.columnWidth = 20;
overview.getRange("C:C").format.columnWidth = 42;
overview.getRange("D:D").format.columnWidth = 54;
overview.getRange("E:H").format.columnWidth = 14;
overview.getRange("A2:H3").format.rowHeight = 24;
overview.getRange("A16:D21").format.rowHeight = 38;
overview.getRange("A26:C30").format.rowHeight = 48;
overview.getRange("A34:B36").format.rowHeight = 36;
overview.freezePanes.freezeRows(5);

const headerValues = [["Task", "Assigned To", "Priority", "Start Date", "End Date", "Time Spent (Hours)", "Status", "Phase", "Change Type", "AI Integration", "Acceptance Criteria", "Dependencies", "Notes"]];
const tabColors = {
  "Admin": "#1E2B5E",
  "Department Manager": "#2952C4",
  "Investigator": "#7C3AED",
  "Action Owner": "#D97706",
  "Staff": "#0F766E",
};

for (const roleName of roleNames) {
  const sheet = workbook.worksheets.getItem(roleName);
  const tasks = rolePlans[roleName];
  const lastRow = 4 + tasks.length;
  sheet.showGridLines = false;
  sheet.tabColor = tabColors[roleName];
  sheet.getRange("A2:M2").merge();
  sheet.getRange("A2").values = [[`${roleName} Delivery Plan`]];
  sheet.getRange("A2").format.font = { name: fontFamily, size: 15, bold: true, color: tabColors[roleName] };
  sheet.getRange("A3").values = [["Tasks"]];
  sheet.getRange("B3").formulas = [[`=COUNTA(A5:A200)`]];
  sheet.getRange("C3").values = [["Completed"]];
  sheet.getRange("D3").formulas = [[`=COUNTIF(G5:G200,"Completed")`]];
  sheet.getRange("E3").values = [["Progress"]];
  sheet.getRange("F3").formulas = [[`=IF(B3=0,0,D3/B3)`]];
  sheet.getRange("F3").format.numberFormat = "0%";
  sheet.getRange("A3:F3").format = { fill: "#E8ECF5", font: { name: fontFamily, size: 10, bold: true, color: "#1A2447" }, horizontalAlignment: "center", borders: { preset: "outside", style: "thin", color: "#B8C2D8" } };

  sheet.getRange("A4:M4").values = headerValues;
  sheet.getRange("A4:M4").format = {
    fill: tabColors[roleName],
    font: { name: fontFamily, size: 10, bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "inside", style: "thin", color: "#FFFFFF" },
  };

  const rows = tasks.map((item) => [
    item.taskName,
    item.assignedTo,
    item.priority,
    item.startDate,
    item.endDate,
    item.timeSpent,
    item.status,
    item.phase,
    item.changeType,
    item.aiIntegration,
    item.acceptanceCriteria,
    item.dependencies,
    item.notes,
  ]);
  sheet.getRange(`A5:M${lastRow}`).values = rows;
  sheet.getRange(`A5:M${lastRow}`).format = {
    font: { name: fontFamily, size: 10, color: "#1A2447" },
    verticalAlignment: "top",
    wrapText: true,
    borders: { insideHorizontal: { style: "thin", color: "#D8DCE8" } },
  };
  sheet.getRange(`B5:I${lastRow}`).format.verticalAlignment = "center";
  sheet.getRange(`B5:I${lastRow}`).format.horizontalAlignment = "center";
  sheet.getRange(`D5:E${lastRow}`).format.numberFormat = "yyyy-mm-dd";
  sheet.getRange(`F5:F${lastRow}`).format.numberFormat = "0.0";
  sheet.getRange(`B5:B200`).dataValidation = { rule: { type: "list", values: owners } };
  sheet.getRange(`C5:C200`).dataValidation = { rule: { type: "list", values: priorities } };
  sheet.getRange(`G5:G200`).dataValidation = { rule: { type: "list", values: statuses } };
  sheet.getRange(`I5:I200`).dataValidation = { rule: { type: "list", values: changeTypes } };

  const priorityRange = sheet.getRange(`C5:C200`);
  priorityRange.conditionalFormats.add("containsText", { text: "Critical", format: { fill: "#FDECEC", font: { bold: true, color: "#B42318" } } });
  priorityRange.conditionalFormats.add("containsText", { text: "High", format: { fill: "#FFF1E6", font: { bold: true, color: "#C2410C" } } });
  priorityRange.conditionalFormats.add("containsText", { text: "Medium", format: { fill: "#FFF8D8", font: { color: "#8A6400" } } });
  priorityRange.conditionalFormats.add("containsText", { text: "Low", format: { fill: "#EAF7EE", font: { color: "#157A3D" } } });
  const statusRange = sheet.getRange(`G5:G200`);
  statusRange.conditionalFormats.add("containsText", { text: "Completed", format: { fill: "#EAF7EE", font: { bold: true, color: "#157A3D" } } });
  statusRange.conditionalFormats.add("containsText", { text: "In Progress", format: { fill: "#EAF1FF", font: { bold: true, color: "#1D4ED8" } } });
  statusRange.conditionalFormats.add("containsText", { text: "Blocked", format: { fill: "#FDECEC", font: { bold: true, color: "#B42318" } } });
  statusRange.conditionalFormats.add("containsText", { text: "In Review", format: { fill: "#F3E8FF", font: { color: "#7C3AED" } } });

  const tableName = `${roleName.replaceAll(" ", "")}Tasks`;
  const table = sheet.tables.add(`A4:M${lastRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  table.showBandedRows = true;

  sheet.getRange("A:A").format.columnWidth = 48;
  sheet.getRange("B:B").format.columnWidth = 15;
  sheet.getRange("C:C").format.columnWidth = 12;
  sheet.getRange("D:E").format.columnWidth = 13;
  sheet.getRange("F:F").format.columnWidth = 18;
  sheet.getRange("G:G").format.columnWidth = 14;
  sheet.getRange("H:H").format.columnWidth = 25;
  sheet.getRange("I:I").format.columnWidth = 24;
  sheet.getRange("J:J").format.columnWidth = 46;
  sheet.getRange("K:K").format.columnWidth = 58;
  sheet.getRange("L:L").format.columnWidth = 34;
  sheet.getRange("M:M").format.columnWidth = 28;
  sheet.getRange(`A5:M${lastRow}`).format.rowHeight = 54;
  sheet.getRange("A4:M4").format.rowHeight = 34;
  sheet.freezePanes.freezeRows(4);
  sheet.freezePanes.freezeColumns(2);
}

workbook.recalculate();

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const inspectSummary = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 13,
});
console.log(inspectSummary.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

for (const sheetName of ["Project Overview", ...roleNames]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  const safeName = sheetName.toLowerCase().replaceAll(" ", "-");
  await fs.writeFile(path.join(previewDir, `${safeName}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);
console.log(JSON.stringify({ outputPath, previewDir, sheetCount: 1 + roleNames.length, taskCounts: Object.fromEntries(roleNames.map((name) => [name, rolePlans[name].length])) }));
