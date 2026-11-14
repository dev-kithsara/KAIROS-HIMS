// backend/prisma/seed.ts

import {
  PrismaClient,
  Severity,
  IncidentStatus,
  CapaType,
  CapaPriority,
  CapaStatus,
  ReviewOutcome,
  ActionStatus,
  ActionReviewStatus,
  ActionType,
  Priority,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KAIROS-HIMS Clinical Database Seeding...');

  // 1. Hash standard password for all test credentials
  const defaultPassword = await bcrypt.hash('password123', 10);

  // 2. Create or Upsert Primary Departments
  const icuDept = await prisma.department.upsert({
    where: { name: 'Intensive Care Unit (ICU)' },
    update: {},
    create: { name: 'Intensive Care Unit (ICU)' },
  });

  const cardDept = await prisma.department.upsert({
    where: { name: 'Cardiology' },
    update: {},
    create: { name: 'Cardiology' },
  });

  console.log('✅ Departments initialized: ICU & Cardiology');

  // 3. Define Clinical Personnel for ICU & Enterprise Roles
  const usersToSeed = [
    // System Administrator
    {
      email: 'admin@hospital.com',
      name: 'System Administrator',
      role: 'ADMIN',
      departmentId: icuDept.id,
    },

    // ICU Department Manager
    {
      email: 'icu.manager@hospital.com',
      name: 'Dr. Rohan Jayasinghe (ICU Director)',
      role: 'MANAGER',
      departmentId: icuDept.id,
    },

    // 4 ICU Clinical Staff Reporters
    {
      email: 'icu.staff1@hospital.com',
      name: 'Nayana Kumari (Senior ICU Sister)',
      role: 'STAFF',
      departmentId: icuDept.id,
    },
    {
      email: 'icu.staff2@hospital.com',
      name: 'Dr. Ruwan Dissanayake (ICU Medical Officer)',
      role: 'STAFF',
      departmentId: icuDept.id,
    },
    {
      email: 'icu.staff3@hospital.com',
      name: 'Anusha Fernando (ICU Staff Nurse)',
      role: 'STAFF',
      departmentId: icuDept.id,
    },
    {
      email: 'icu.staff4@hospital.com',
      name: 'Chathura Wickramasinghe (ICU Staff Nurse)',
      role: 'STAFF',
      departmentId: icuDept.id,
    },

    // 1 Dedicated ICU Clinical Investigator
    {
      email: 'icu.investigator@hospital.com',
      name: 'Dr. Priyantha Silva (Clinical Investigator)',
      role: 'INVESTIGATOR',
      departmentId: icuDept.id,
    },

    // 2 ICU Action Owners (Nursing Protocols Lead & Biomedical Lead)
    {
      email: 'icu.action1@hospital.com',
      name: 'Sister Sandya Kumari (ICU Nursing Lead / CAPA)',
      role: 'ACTION_OWNER',
      departmentId: icuDept.id,
    },
    {
      email: 'icu.action2@hospital.com',
      name: 'Eng. Dinesh Jayawardena (Biomedical Lead / CAPA)',
      role: 'ACTION_OWNER',
      departmentId: icuDept.id,
    },

    // Legacy Cardiology users for backward compatibility
    {
      email: 'manager@hospital.com',
      name: 'Dr. Manager',
      role: 'MANAGER',
      departmentId: cardDept.id,
    },
    { email: 'staff@hospital.com', name: 'Kamal Perera', role: 'STAFF', departmentId: cardDept.id },
    {
      email: 'investigator@hospital.com',
      name: 'Nimal Investigator',
      role: 'INVESTIGATOR',
      departmentId: cardDept.id,
    },
    {
      email: 'actionowner@hospital.com',
      name: 'Sunil Action Owner',
      role: 'ACTION_OWNER',
      departmentId: cardDept.id,
    },
  ];

  const userMap: Record<string, any> = {};
  for (const u of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: defaultPassword,
        role: u.role,
        name: u.name,
        departmentId: u.departmentId,
      },
      create: { ...u, password: defaultPassword },
    });
    userMap[u.email] = user;
  }

  console.log('✅ 13 Clinical Users seeded successfully across all portals.');

  // Aliases for cleaner incident wiring
  const icuManager = userMap['icu.manager@hospital.com'];
  const s1 = userMap['icu.staff1@hospital.com'];
  const s2 = userMap['icu.staff2@hospital.com'];
  const s3 = userMap['icu.staff3@hospital.com'];
  const s4 = userMap['icu.staff4@hospital.com'];
  const inv = userMap['icu.investigator@hospital.com'];
  const ao1 = userMap['icu.action1@hospital.com']; // Nursing Lead
  const ao2 = userMap['icu.action2@hospital.com']; // Biomedical Lead

  // 4. Clean existing incidents and actions to ensure clean state on re-seeding
  await prisma.actionEvidence.deleteMany({});
  await prisma.actionHistory.deleteMany({});
  await prisma.actionNotification.deleteMany({});
  await prisma.actionItem.deleteMany({});
  await prisma.managementReview.deleteMany({});
  await prisma.capaAction.deleteMany({});
  await prisma.incidentControl.deleteMany({});
  await prisma.incidentAttachment.deleteMany({});
  await prisma.incidentAuditLog.deleteMany({});
  await prisma.incident.deleteMany({});

  console.log('🧹 Cleaned existing incident state for idempotent seed.');

  // 5. 20 Realistic Clinical Incidents (5 from each of the 4 Staff Members)
  const clinicalIncidents = [
    // ── Staff 1: Senior Sister Nayana Kumari ─────────────────────────
    {
      title: 'High-Alert Noradrenaline Infusion Rate Discrepancy',
      description:
        'During 06:00 IV titration in Bed 03, smart infusion pump delivered 0.12 mcg/kg/min instead of prescribed 0.04 mcg/kg/min due to drug concentration library mismatch.',
      severity: Severity.CRITICAL,
      category: 'MEDICATION & IV FLUIDS',
      location: 'ICU Bay 1 - Bed 03',
      status: IncidentStatus.OPEN,
      departmentId: icuDept.id,
      reporterId: s1.id,
    },
    {
      title: 'Mechanical Ventilator High-Pressure Alarm Failure',
      description:
        'Servo-U ventilator in Bed 06 failed to trigger acoustic alarm when endotracheal tube was partially kinked. Detected visually by bedside nurse.',
      severity: Severity.HIGH,
      category: 'EQUIPMENT & MEDICAL DEVICES',
      location: 'ICU Bay 2 - Bed 06',
      status: IncidentStatus.ACCEPTED,
      departmentId: icuDept.id,
      reporterId: s1.id,
    },
    {
      title: 'Suspected CLABSI in Bed 04 Triple-Lumen Central Line',
      description:
        'Blood cultures drawn from 8-day-old internal jugular CVC confirmed Klebsiella pneumoniae bacteremia with localized exit site erythema.',
      severity: Severity.HIGH,
      category: 'INFECTION CONTROL',
      location: 'ICU Bay 1 - Bed 04',
      status: IncidentStatus.INVESTIGATING,
      departmentId: icuDept.id,
      reporterId: s1.id,
      investigatorId: inv.id,
      rootCause:
        'Break in sterile chlorhexidine dressing protocol during post-cardiac arrest emergency central line insertion.',
      rootCauseCategory: 'Procedure Complication',
      investigationFindings:
        'Review of dressing log indicated central line dressing was not changed at Day 7 benchmark as mandated by ICU IPC protocol.',
      investigationReviewStatus: 'PENDING',
    },
    {
      title: 'Shift Handover Delay on Arterial Blood Gas Critical Lactate Relay',
      description:
        'STAT ABG result showing lactate of 4.8 mmol/L at 14:15 was not communicated to incoming night team during shift handover, delaying septic shock protocol escalation by 90 minutes.',
      severity: Severity.MEDIUM,
      category: 'COMMUNICATION & HANDOVER',
      location: 'ICU Central Nursing Station',
      status: IncidentStatus.PENDING_ACTION,
      departmentId: icuDept.id,
      reporterId: s1.id,
      investigatorId: inv.id,
      actionOwnerId: ao1.id,
      rootCause:
        'Verbal critical value handover interrupted by urgent Code Blue call in adjacent ward.',
      rootCauseCategory: 'Communication Error',
      investigationReviewStatus: 'APPROVED',
      capaAction: {
        title: 'Mandatory Electronic Handover Check-Off for Critical Lab Values',
        actionType: CapaType.PREVENTIVE,
        priority: CapaPriority.HIGH,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        description:
          'Institute digital SBAR handover dashboard where critical laboratory values require two-person cryptographic sign-off.',
        actionOwnerId: ao1.id,
        status: CapaStatus.IN_PROGRESS,
      },
    },
    {
      title: 'Patient Extubation Risk during Post-Op Lateral Turning',
      description:
        'Endotracheal tube displaced 3cm during lateral repositioning of post-coronary bypass patient. Airway promptly secured without desaturation.',
      severity: Severity.HIGH,
      category: 'PATIENT SAFETY & FALLS',
      location: 'ICU Bay 1 - Bed 02',
      status: IncidentStatus.CLOSED,
      departmentId: icuDept.id,
      reporterId: s1.id,
      investigatorId: inv.id,
      actionOwnerId: ao1.id,
      closedAt: new Date(),
      closedById: icuManager.id,
      closureSummary:
        'Investigation confirmed airway anchor tape slippage. Replaced with commercial endotracheal tube harness. 100% staff training completed.',
      review: {
        outcome: ReviewOutcome.APPROVED,
        lessonsLearned:
          'Standardize commercial tube fasteners across all mechanically ventilated adult beds.',
        outcomeComments:
          'Zero unplanned extubation incidents recorded in subsequent 30-day monitoring.',
        followUpMonitoring: 'Monthly clinical audit of ET-tube fixation integrity.',
        reviewedById: icuManager.id,
      },
    },

    // ── Staff 2: Dr. Ruwan Dissanayake (ICU MO) ──────────────────────
    {
      title: 'Video Laryngoscope Screen Malfunction during Emergency Intubation',
      description:
        'High-definition display blacked out intermittently during rapid sequence induction in acute respiratory distress patient. Direct Macintosh blade used as fallback.',
      severity: Severity.HIGH,
      category: 'EQUIPMENT & MEDICAL DEVICES',
      location: 'ICU Resuscitation Bay',
      status: IncidentStatus.OPEN,
      departmentId: icuDept.id,
      reporterId: s2.id,
    },
    {
      title: 'Agitated Patient Unwitnessed Bed Fall in Bay 3',
      description:
        'Septic encephalopathy patient climbed over lowered side-rail while on dexmedetomidine infusion. Sustained 2cm scalp abrasion; CT brain negative.',
      severity: Severity.HIGH,
      category: 'PATIENT SAFETY & FALLS',
      location: 'ICU Bay 3 - Bed 08',
      status: IncidentStatus.INVESTIGATING,
      departmentId: icuDept.id,
      reporterId: s2.id,
      investigatorId: inv.id,
      rootCause:
        'Side rail was inadvertently left down following physician arterial blood sample draw.',
      rootCauseCategory: 'Monitoring Failure',
      investigationFindings:
        'Richmond Agitation-Sedation Scale (RASS) score had progressed from -1 to +2 without documentation in nursing observation record.',
      investigationReviewStatus: 'PENDING',
    },
    {
      title: 'Concentrated Potassium Chloride Ampoule in General ICU Drug Cupboard',
      description:
        '15% KCl ampoule found in general electrolyte shelf instead of double-locked high-alert poison safe during morning pharmacy stock count.',
      severity: Severity.CRITICAL,
      category: 'MEDICATION & IV FLUIDS',
      location: 'ICU Medication Preparation Room',
      status: IncidentStatus.PENDING_ACTION,
      departmentId: icuDept.id,
      reporterId: s2.id,
      investigatorId: inv.id,
      actionOwnerId: ao1.id,
      rootCause:
        'Replenishment delivery box from central pharmacy left unattended without dual verification barcode scan.',
      rootCauseCategory: 'Protocol Breach',
      investigationReviewStatus: 'APPROVED',
      capaAction: {
        title: 'Biometric Double-Lock High-Alert Medication Safe Dispenser Installation',
        actionType: CapaType.PREVENTIVE,
        priority: CapaPriority.CRITICAL,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        description:
          'Remove all concentrated potassium ampoules from unit stock; enforce premixed IV bags exclusively.',
        actionOwnerId: ao1.id,
        status: CapaStatus.IN_PROGRESS,
      },
    },
    {
      title: 'Packed Red Blood Cells (PRBC) Cross-Match Delivery Delay',
      description:
        'Urgent 2 units PRBC requested for active GI bleed took 85 minutes to arrive from blood bank due to pneumatic tube system jam.',
      severity: Severity.HIGH,
      category: 'CLINICAL / PATIENT CARE',
      location: 'ICU Bay 2 - Bed 05',
      status: IncidentStatus.UNDER_REVIEW,
      departmentId: icuDept.id,
      reporterId: s2.id,
      investigatorId: inv.id,
      actionOwnerId: ao2.id,
      capaAction: {
        title: 'Emergency Blood Transport Protocol via Dedicated Human Runner',
        actionType: CapaType.CORRECTIVE,
        priority: CapaPriority.HIGH,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        description:
          'Establish protocol where MTP (Massive Transfusion Protocol) bypasses pneumatic tube system completely.',
        actionOwnerId: ao2.id,
        status: CapaStatus.COMPLETED,
        evidenceNotes:
          'Tested runner pathway: transit time reduced to 6 minutes. Runner pagers configured.',
        isVerified: false,
      },
    },
    {
      title: 'ICU Resuscitation Bay Defibrillator Self-Test Failure',
      description:
        'Zoll R-Series biphasic defibrillator battery check LED showed red maintenance indicator during daily morning shift inspection.',
      severity: Severity.CRITICAL,
      category: 'EQUIPMENT & MEDICAL DEVICES',
      location: 'ICU Resuscitation Bay',
      status: IncidentStatus.CLOSED,
      departmentId: icuDept.id,
      reporterId: s2.id,
      investigatorId: inv.id,
      actionOwnerId: ao2.id,
      closedAt: new Date(),
      closedById: icuManager.id,
      closureSummary:
        'Defibrillator lithium battery internal cell failure. Unit replaced immediately with standby unit from CCU. Battery vendor warranty replaced.',
      review: {
        outcome: ReviewOutcome.APPROVED,
        lessonsLearned:
          'Institute automated weekly battery discharge test cycle with biomedical logging.',
        outcomeComments: 'Biomedical engineering validated all 4 hospital crash cart batteries.',
        followUpMonitoring: 'Monthly battery impedance testing logs.',
        reviewedById: icuManager.id,
      },
    },

    // ── Staff 3: Nurse Anusha Fernando ───────────────────────────────
    {
      title: 'Central Arterial Line Pressure Transducer Cable Disconnection',
      description:
        'Radial arterial line monitor cable disconnected during bed linen change, leading to false asystole alarm and 4-minute loss of invasive blood pressure tracking.',
      severity: Severity.HIGH,
      category: 'CLINICAL / PATIENT CARE',
      location: 'ICU Bay 2 - Bed 07',
      status: IncidentStatus.OPEN,
      departmentId: icuDept.id,
      reporterId: s3.id,
    },
    {
      title: 'Medical Gas Oxygen Manifold Low Pressure Alarm in ICU Bay 2',
      description:
        'Zone valve box 2 alarm sounder triggered showing pipeline supply pressure drop to 3.2 bar (normal: 4.1 bar) for 12 seconds before auto-switchover.',
      severity: Severity.CRITICAL,
      category: 'FACILITIES & INFRASTRUCTURE',
      location: 'ICU Pipeline Supply Corridor',
      status: IncidentStatus.ACCEPTED,
      departmentId: icuDept.id,
      reporterId: s3.id,
    },
    {
      title: 'Catheter-Associated Urinary Tract Infection (CAUTI) in Bed 07',
      description:
        'Patient in Bed 07 developed fever and cloudy urine after 9 days of indwelling Foley catheter. Urine culture grew Pseudomonas aeruginosa > 10^5 CFU/mL.',
      severity: Severity.MEDIUM,
      category: 'INFECTION CONTROL',
      location: 'ICU Bay 2 - Bed 07',
      status: IncidentStatus.INVESTIGATING,
      departmentId: icuDept.id,
      reporterId: s3.id,
      investigatorId: inv.id,
      rootCause:
        'Urinary drainage bag kept level with bed mattress instead of below bladder during CT scan transfer.',
      rootCauseCategory: 'Nursing Care Error',
      investigationFindings:
        'No daily nurse-driven catheter necessity assessment was documented between Day 5 and Day 8.',
      investigationReviewStatus: 'PENDING',
    },
    {
      title: 'Insulin Infusion Syringe Driver Rate Drift',
      description:
        'Alaris CC syringe pump delivering regular human insulin at 4.2 units/hr had mechanical lead screw slippage, causing patient glucose drop to 2.4 mmol/L.',
      severity: Severity.HIGH,
      category: 'EQUIPMENT & MEDICAL DEVICES',
      location: 'ICU Bay 1 - Bed 01',
      status: IncidentStatus.UNDER_REVIEW,
      departmentId: icuDept.id,
      reporterId: s3.id,
      investigatorId: inv.id,
      actionOwnerId: ao2.id,
      capaAction: {
        title: 'Complete Biomedical Calibration and Optical Sensor Overhaul of Syringe Fleet',
        actionType: CapaType.CORRECTIVE,
        priority: CapaPriority.HIGH,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        description:
          'Recalibrate drive mechanism of all 24 ICU infusion pumps using laser micrometer testing jig.',
        actionOwnerId: ao2.id,
        status: CapaStatus.COMPLETED,
        evidenceNotes: 'Calibration certificates uploaded for all pumps. Firmware updated to v4.8.',
        isVerified: false,
      },
    },
    {
      title: 'Water Leakage near ICU Visitor Airlock Door',
      description:
        'Air conditioning condensate water dripped on visitor entry linoleum floor creating slip hazard.',
      severity: Severity.LOW,
      category: 'FACILITIES & INFRASTRUCTURE',
      location: 'ICU Main Entrance Airlock',
      status: IncidentStatus.REJECTED,
      rejectionReason:
        'Routine building maintenance issue handled by HVAC team within 20 minutes. No patient or clinical personnel exposure.',
      departmentId: icuDept.id,
      reporterId: s3.id,
    },

    // ── Staff 4: Nurse Chathura Wickramasinghe ───────────────────────
    {
      title: 'Continuous Renal Replacement Therapy (CRRT) Circuit Premature Clotting',
      description:
        'Prismaflex hemofilter clotted within 3.5 hours of initiation due to heparin pre-filter titration discrepancy, causing 180mL blood loss in circuit.',
      severity: Severity.MEDIUM,
      category: 'CLINICAL / PATIENT CARE',
      location: 'ICU Bay 3 - Bed 11',
      status: IncidentStatus.OPEN,
      departmentId: icuDept.id,
      reporterId: s4.id,
    },
    {
      title: 'Mislabeled STAT Blood Culture Bottles for Sepsis Protocol',
      description:
        'Blood culture bottles drawn from Bed 09 had Bed 10 barcode sticker attached. Discrepancy identified by phlebotomist before lab processing.',
      severity: Severity.HIGH,
      category: 'CLINICAL / PATIENT CARE',
      location: 'ICU Bay 3 - Bed 09',
      status: IncidentStatus.ACCEPTED,
      departmentId: icuDept.id,
      reporterId: s4.id,
    },
    {
      title: 'Intermittent Pneumatic Compression (IPC) Device Failure for DVT Prophylaxis',
      description:
        'Kendall SCD sleeve pump motor overheated and shut down silently on Bed 10 post-abdominal surgery patient for ~6 hours.',
      severity: Severity.MEDIUM,
      category: 'EQUIPMENT & MEDICAL DEVICES',
      location: 'ICU Bay 3 - Bed 10',
      status: IncidentStatus.INVESTIGATING,
      departmentId: icuDept.id,
      reporterId: s4.id,
      investigatorId: inv.id,
      rootCause: 'Ventilation intake filter completely clogged with lint and environmental dust.',
      rootCauseCategory: 'Maintenance Defect',
      investigationFindings:
        'Biomedical preventative maintenance tag had expired 45 days prior without unit recall.',
      investigationReviewStatus: 'PENDING',
    },
    {
      title: 'Code Blue Laryngoscope Blade Illumination Failure',
      description:
        'Size 4 Macintosh blade bulb flickered and died during emergency endotracheal intubation in cardiac arrest. Secondary cart blade retrieved.',
      severity: Severity.CRITICAL,
      category: 'EQUIPMENT & MEDICAL DEVICES',
      location: 'ICU Bay 3 - Bed 12',
      status: IncidentStatus.PENDING_ACTION,
      departmentId: icuDept.id,
      reporterId: s4.id,
      investigatorId: inv.id,
      actionOwnerId: ao2.id,
      rootCause: 'Corrosion of contact spring inside reusable battery handle.',
      rootCauseCategory: 'Equipment Failure',
      investigationReviewStatus: 'APPROVED',
      capaAction: {
        title: 'Transition to Disposable Single-Use Fiberoptic LED Laryngoscope Blades',
        actionType: CapaType.PREVENTIVE,
        priority: CapaPriority.CRITICAL,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        description:
          'Phasing out incandescent bulb handles in favor of pre-sterilized green-spec fiberoptic blades across ICU.',
        actionOwnerId: ao2.id,
        status: CapaStatus.NOT_STARTED,
      },
    },
    {
      title: 'Needle Stick Injury during Arterial Blood Gas Sampling',
      description:
        'Staff nurse sustained superficial puncture to left index finger while disposing unshielded 22G arterial needle into overfilled sharps container.',
      severity: Severity.MEDIUM,
      category: 'INFECTION CONTROL',
      location: 'ICU Bay 2 - Bed 08',
      status: IncidentStatus.CLOSED,
      departmentId: icuDept.id,
      reporterId: s4.id,
      investigatorId: inv.id,
      actionOwnerId: ao1.id,
      closedAt: new Date(),
      closedById: icuManager.id,
      closureSummary:
        'Source patient viral screen negative. Staff member received immediate PEP counseling. Replaced all sharps bins at 3/4 fill line policy enforced.',
      review: {
        outcome: ReviewOutcome.APPROVED,
        lessonsLearned:
          'Strict zero-tolerance on sharps bins filled above the fill-line watermark.',
        outcomeComments: 'Installed automatic safety-shield needle syringes hospital-wide.',
        followUpMonitoring: 'Occupational health 3-month serology surveillance.',
        reviewedById: icuManager.id,
      },
    },
  ];

  // 6. Insert all 20 Incidents and wire CAPAs & Reviews
  let count = 0;
  const createdIncidents: any[] = [];
  for (const item of clinicalIncidents) {
    const { capaAction, review, ...incidentData } = item as any;

    const createdIncident = await prisma.incident.create({
      data: incidentData,
    });
    createdIncidents.push(createdIncident);

    // Wire CAPA Action if present
    if (capaAction) {
      await prisma.capaAction.create({
        data: {
          ...capaAction,
          incidentId: createdIncident.id,
        },
      });
    }

    // Wire Management Review if present
    if (review) {
      await prisma.managementReview.create({
        data: {
          ...review,
          incidentId: createdIncident.id,
        },
      });
    }

    count++;
  }

  // 7. Seed Full-Fidelity Action Items for Action Owner Portal (ao1 & ao2)
  console.log('🌱 Seeding clinical Action Items and audit histories for Action Owners...');

  // ── Action Items for Sister Sandya Kumari (ao1 - ICU Nursing Lead) ──
  // 1. OVERDUE
  const ao1_overdue = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[0].id,
      ownerId: ao1.id,
      title: 'Emergency audit and calibration of smart infusion pump drug libraries',
      description: 'Verify concentration libraries on all 24 smart pumps against ICU pharmacopeia standards following rate discrepancy.',
      type: ActionType.CORRECTIVE,
      priority: Priority.CRITICAL,
      dueDate: new Date(Date.now() - 3 * 86400000),
      status: ActionStatus.OPEN,
      reviewStatus: ActionReviewStatus.ACTIVE,
      completionRiskScore: 92,
      riskExplanation: { score: 92, level: 'HIGH', factors: ['critical priority', '3 day(s) overdue', 'work has not started'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.create({
    data: {
      actionItemId: ao1_overdue.id,
      actorId: icuManager.id,
      eventType: 'ASSIGNED',
      toStatus: 'OPEN',
      note: 'Assigned as high-priority CAPA item following infusion rate incident.',
    },
  });

  // 2. REVISION REQUIRED
  const ao1_revision = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[1].id,
      ownerId: ao1.id,
      title: 'ICU high-alert potassium chloride double-check signoff SOP',
      description: 'Implement mandatory digital barcode cross-matching and dual registered nurse verification before IV infusion of high-potency electrolytes.',
      type: ActionType.PREVENTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 2 * 86400000),
      status: ActionStatus.IN_PROGRESS,
      reviewStatus: ActionReviewStatus.RETURNED_FOR_REVISION,
      progressNote: 'Initial draft policy was circulated among senior staff nurses.',
      managerReviewComment: 'Clinical pharmacy audit showed night shift compliance was missing. Re-train nursing staff and attach sign-off sheet.',
      completionRiskScore: 75,
      riskExplanation: { score: 75, level: 'HIGH', factors: ['high priority', 'due in 2 day(s)', 'returned by manager for revision'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao1_revision.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned as systemic preventive measure.',
      },
      {
        actionItemId: ao1_revision.id,
        actorId: ao1.id,
        eventType: 'PROGRESS_UPDATED',
        fromStatus: 'OPEN',
        toStatus: 'IN_PROGRESS',
        note: 'Initial draft policy was circulated among senior staff nurses.',
      },
      {
        actionItemId: ao1_revision.id,
        actorId: icuManager.id,
        eventType: 'RETURNED_FOR_REVISION',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'IN_PROGRESS',
        note: 'Clinical pharmacy audit showed night shift compliance was missing. Re-train nursing staff and attach sign-off sheet.',
      },
    ],
  });

  // 3. IN PROGRESS
  const ao1_inProgress = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[2].id,
      ownerId: ao1.id,
      title: 'Mandatory Electronic Handover Check-Off for Critical Lab Values',
      description: 'Institute digital SBAR handover dashboard where critical laboratory values require two-person cryptographic sign-off.',
      type: ActionType.PREVENTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 7 * 86400000),
      status: ActionStatus.IN_PROGRESS,
      reviewStatus: ActionReviewStatus.ACTIVE,
      progressNote: 'Software template designed with IT department. Pilot testing in Bay 1 currently ongoing.',
      completionRiskScore: 35,
      riskExplanation: { score: 35, level: 'MEDIUM', factors: ['high priority', 'in progress', 'due in 7 day(s)'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao1_inProgress.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned to modernize lab handover protocol.',
      },
      {
        actionItemId: ao1_inProgress.id,
        actorId: ao1.id,
        eventType: 'PROGRESS_UPDATED',
        fromStatus: 'OPEN',
        toStatus: 'IN_PROGRESS',
        note: 'Software template designed with IT department. Pilot testing in Bay 1 currently ongoing.',
      },
    ],
  });

  // 4. AWAITING VERIFICATION
  const ao1_awaiting = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[3].id,
      ownerId: ao1.id,
      title: 'Clinical protocol update: Central line bundle dressing change protocol',
      description: 'Enforce chlorhexidine-impregnated sponge dressings and bi-weekly sterile technique audit for central venous catheter maintenance.',
      type: ActionType.CORRECTIVE,
      priority: Priority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 86400000),
      status: ActionStatus.COMPLETED,
      reviewStatus: ActionReviewStatus.COMPLETED_PENDING_VERIFICATION,
      progressNote: 'Completed education of 18 ICU sisters. Dressing protocol laminated and posted at all 12 beds.',
      verificationNotes: 'Full training register signed by Sister Nayana and verified against checklist. Submitting for manager signoff.',
      completedAt: new Date(),
      completionRiskScore: 15,
      riskExplanation: { score: 15, level: 'LOW', factors: ['submitted for verification'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao1_awaiting.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned following line infection review.',
      },
      {
        actionItemId: ao1_awaiting.id,
        actorId: ao1.id,
        eventType: 'PROGRESS_UPDATED',
        fromStatus: 'OPEN',
        toStatus: 'IN_PROGRESS',
        note: 'Completed education of 18 ICU sisters. Dressing protocol laminated and posted at all 12 beds.',
      },
      {
        actionItemId: ao1_awaiting.id,
        actorId: ao1.id,
        eventType: 'SUBMITTED_FOR_VERIFICATION',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'COMPLETED',
        note: 'Work completed. Submitting certification documents for Manager verification.',
      },
    ],
  });

  // 5. VERIFIED
  const ao1_verified = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[4].id,
      ownerId: ao1.id,
      title: 'Standardized ICU arterial line flush solution labeling protocol',
      description: 'Deploy neon color-coded labels and heparinized saline warning sleeves on all invasive pressure monitoring lines.',
      type: ActionType.PREVENTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() - 5 * 86400000),
      status: ActionStatus.COMPLETED,
      reviewStatus: ActionReviewStatus.VERIFIED,
      progressNote: 'Color-coded fluorescent tags deployed on all 12 bedside flush bags.',
      verificationNotes: 'Audit confirmed 100% adherence over 14 consecutive shifts.',
      managerReviewComment: 'Validated by Dr. Jayasinghe. Zero medication confusion incidents recorded.',
      effectiveness: 'EFFECTIVE',
      effectivenessScore: 98,
      completedAt: new Date(Date.now() - 6 * 86400000),
      completionRiskScore: 10,
      riskExplanation: { score: 10, level: 'LOW', factors: ['verified complete'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao1_verified.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned preventive labeling update.',
      },
      {
        actionItemId: ao1_verified.id,
        actorId: ao1.id,
        eventType: 'SUBMITTED_FOR_VERIFICATION',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'COMPLETED',
        note: 'Adherence audit submitted with 100% compliance.',
      },
      {
        actionItemId: ao1_verified.id,
        actorId: icuManager.id,
        eventType: 'VERIFIED',
        fromStatus: 'COMPLETED',
        toStatus: 'COMPLETED',
        note: 'Validated by Dr. Jayasinghe. Zero medication confusion incidents recorded.',
      },
    ],
  });

  // 6. OPEN / NOT STARTED
  const ao1_open = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[7].id,
      ownerId: ao1.id,
      title: 'Biometric Double-Lock High-Alert Medication Safe Dispenser Installation',
      description: 'Remove all concentrated potassium ampoules from unit stock; enforce premixed IV bags exclusively.',
      type: ActionType.PREVENTIVE,
      priority: Priority.CRITICAL,
      dueDate: new Date(Date.now() + 10 * 86400000),
      status: ActionStatus.OPEN,
      reviewStatus: ActionReviewStatus.ACTIVE,
      completionRiskScore: 40,
      riskExplanation: { score: 40, level: 'MEDIUM', factors: ['critical priority', 'work not started'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.create({
    data: {
      actionItemId: ao1_open.id,
      actorId: icuManager.id,
      eventType: 'ASSIGNED',
      toStatus: 'OPEN',
      note: 'Assigned safe dispenser migration.',
    },
  });

  // ── Action Items for Eng. Dinesh Jayawardena (ao2 - Biomedical Lead) ──
  // 1. OVERDUE
  const ao2_overdue = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[1].id,
      ownerId: ao2.id,
      title: 'Mechanical Ventilator Acoustic Alarm Transducer Replacement & SPL Testing',
      description: 'Conduct sound pressure level (SPL) acoustic testing across all 8 Servo-U mechanical ventilators and replace aged piezoceramic transducers.',
      type: ActionType.CORRECTIVE,
      priority: Priority.CRITICAL,
      dueDate: new Date(Date.now() - 4 * 86400000),
      status: ActionStatus.OPEN,
      reviewStatus: ActionReviewStatus.ACTIVE,
      completionRiskScore: 94,
      riskExplanation: { score: 94, level: 'HIGH', factors: ['critical priority', '4 day(s) overdue', 'work has not started'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.create({
    data: {
      actionItemId: ao2_overdue.id,
      actorId: icuManager.id,
      eventType: 'ASSIGNED',
      toStatus: 'OPEN',
      note: 'Urgent biomedical assignment following ventilator silence incident.',
    },
  });

  // 2. REVISION REQUIRED
  const ao2_revision = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[12].id,
      ownerId: ao2.id,
      title: 'Complete Biomedical Calibration and Optical Sensor Overhaul of Syringe Fleet',
      description: 'Recalibrate drive mechanism of all 24 ICU infusion pumps using laser micrometer testing jig.',
      type: ActionType.CORRECTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 3 * 86400000),
      status: ActionStatus.IN_PROGRESS,
      reviewStatus: ActionReviewStatus.RETURNED_FOR_REVISION,
      progressNote: 'Completed drive screw calibration on 20 out of 24 units in service.',
      managerReviewComment: 'Calibration certificates missing for 4 reserve pumps stored in equipment annex. Test all 24 before sign-off.',
      completionRiskScore: 72,
      riskExplanation: { score: 72, level: 'HIGH', factors: ['high priority', 'returned for revision', 'due in 3 day(s)'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao2_revision.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned fleet calibration.',
      },
      {
        actionItemId: ao2_revision.id,
        actorId: ao2.id,
        eventType: 'PROGRESS_UPDATED',
        fromStatus: 'OPEN',
        toStatus: 'IN_PROGRESS',
        note: 'Completed drive screw calibration on 20 out of 24 units in service.',
      },
      {
        actionItemId: ao2_revision.id,
        actorId: icuManager.id,
        eventType: 'RETURNED_FOR_REVISION',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'IN_PROGRESS',
        note: 'Calibration certificates missing for 4 reserve pumps stored in equipment annex. Test all 24 before sign-off.',
      },
    ],
  });

  // 3. IN PROGRESS
  const ao2_inProgress = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[8].id,
      ownerId: ao2.id,
      title: 'Pneumatic tube transport bypass & courier runner paging protocol',
      description: 'Install dedicated high-priority runner alert terminal linking ICU nursing desk directly to blood bank dispatch.',
      type: ActionType.CORRECTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 6 * 86400000),
      status: ActionStatus.IN_PROGRESS,
      reviewStatus: ActionReviewStatus.ACTIVE,
      progressNote: 'Hardware pagers acquired; base station transmitter installed in blood bank.',
      completionRiskScore: 32,
      riskExplanation: { score: 32, level: 'LOW', factors: ['high priority', 'in progress', 'due in 6 day(s)'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao2_inProgress.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned emergency blood runner communication setup.',
      },
      {
        actionItemId: ao2_inProgress.id,
        actorId: ao2.id,
        eventType: 'PROGRESS_UPDATED',
        fromStatus: 'OPEN',
        toStatus: 'IN_PROGRESS',
        note: 'Hardware pagers acquired; base station transmitter installed in blood bank.',
      },
    ],
  });

  // 4. AWAITING VERIFICATION
  const ao2_awaiting = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[16].id,
      ownerId: ao2.id,
      title: 'Emergency Blood Transport Protocol via Dedicated Human Runner',
      description: 'Establish protocol where MTP (Massive Transfusion Protocol) bypasses pneumatic tube system completely.',
      type: ActionType.CORRECTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() + 4 * 86400000),
      status: ActionStatus.COMPLETED,
      reviewStatus: ActionReviewStatus.COMPLETED_PENDING_VERIFICATION,
      progressNote: 'Tested runner pathway: transit time reduced to 5.8 minutes. Full drill records attached.',
      verificationNotes: 'Certified drill logs verified by blood bank supervisor. Submitting for director validation.',
      completedAt: new Date(),
      completionRiskScore: 12,
      riskExplanation: { score: 12, level: 'LOW', factors: ['completed pending verification'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao2_awaiting.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned blood runner verification.',
      },
      {
        actionItemId: ao2_awaiting.id,
        actorId: ao2.id,
        eventType: 'SUBMITTED_FOR_VERIFICATION',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'COMPLETED',
        note: 'Tested runner pathway: transit time reduced to 5.8 minutes. Full drill records attached.',
      },
    ],
  });

  // 5. VERIFIED
  const ao2_verified = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[14].id,
      ownerId: ao2.id,
      title: 'Central telemetry arrhythmia detection algorithm update & validation',
      description: 'Apply manufacturer firmware patch v3.2.1 on Mindray central monitoring station to eliminate asystole false-positive alarms.',
      type: ActionType.PREVENTIVE,
      priority: Priority.HIGH,
      dueDate: new Date(Date.now() - 7 * 86400000),
      status: ActionStatus.COMPLETED,
      reviewStatus: ActionReviewStatus.VERIFIED,
      progressNote: 'Firmware upgraded and simulated ECG waveforms tested across all 12 bedside channels.',
      verificationNotes: 'Biomedical engineering quality assurance test report attached. 0 false artifact alarms logged in 72h run.',
      managerReviewComment: 'Validated by Dr. Jayasinghe. Telemetry station certified fully compliant.',
      effectiveness: 'EFFECTIVE',
      effectivenessScore: 100,
      completedAt: new Date(Date.now() - 8 * 86400000),
      completionRiskScore: 8,
      riskExplanation: { score: 8, level: 'LOW', factors: ['verified complete'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.createMany({
    data: [
      {
        actionItemId: ao2_verified.id,
        actorId: icuManager.id,
        eventType: 'ASSIGNED',
        toStatus: 'OPEN',
        note: 'Assigned firmware validation.',
      },
      {
        actionItemId: ao2_verified.id,
        actorId: ao2.id,
        eventType: 'SUBMITTED_FOR_VERIFICATION',
        fromStatus: 'IN_PROGRESS',
        toStatus: 'COMPLETED',
        note: 'Biomedical engineering QA report attached.',
      },
      {
        actionItemId: ao2_verified.id,
        actorId: icuManager.id,
        eventType: 'VERIFIED',
        fromStatus: 'COMPLETED',
        toStatus: 'COMPLETED',
        note: 'Validated by Dr. Jayasinghe. Telemetry station certified fully compliant.',
      },
    ],
  });

  // 6. OPEN / NOT STARTED
  const ao2_open = await prisma.actionItem.create({
    data: {
      incidentId: createdIncidents[16].id,
      ownerId: ao2.id,
      title: 'Transition to Disposable Single-Use Fiberoptic LED Laryngoscope Blades',
      description: 'Phasing out incandescent bulb handles in favor of pre-sterilized green-spec fiberoptic blades across ICU.',
      type: ActionType.PREVENTIVE,
      priority: Priority.CRITICAL,
      dueDate: new Date(Date.now() + 12 * 86400000),
      status: ActionStatus.OPEN,
      reviewStatus: ActionReviewStatus.ACTIVE,
      completionRiskScore: 38,
      riskExplanation: { score: 38, level: 'MEDIUM', factors: ['critical priority', 'not started'], modelVersion: 'action-risk-rules-v1.0' },
    },
  });
  await prisma.actionHistory.create({
    data: {
      actionItemId: ao2_open.id,
      actorId: icuManager.id,
      eventType: 'ASSIGNED',
      toStatus: 'OPEN',
      note: 'Assigned procurement and equipment decommissioning transition.',
    },
  });

  // 8. Generate Notifications for Action Owners
  await prisma.actionNotification.createMany({
    data: [
      {
        actionItemId: ao1_overdue.id,
        userId: ao1.id,
        type: 'OVERDUE',
        title: 'Action Overdue',
        message: `"${ao1_overdue.title}" is 3 day(s) overdue. Immediate remediation required.`,
      },
      {
        actionItemId: ao1_revision.id,
        userId: ao1.id,
        type: 'RETURNED',
        title: 'Revision Required',
        message: 'Manager requested revision: "Clinical pharmacy audit showed night shift compliance was missing."',
      },
      {
        actionItemId: ao2_overdue.id,
        userId: ao2.id,
        type: 'OVERDUE',
        title: 'Action Overdue',
        message: `"${ao2_overdue.title}" is 4 day(s) overdue. Immediate remediation required.`,
      },
      {
        actionItemId: ao2_revision.id,
        userId: ao2.id,
        type: 'RETURNED',
        title: 'Revision Required',
        message: 'Manager requested revision: "Calibration certificates missing for 4 reserve pumps."',
      },
    ],
  });

  console.log(
    `✅ Successfully seeded ${count} Incidents and 12 Action Items (covering all KPI categories) for Action Owners!`
  );
  console.log('🎉 KAIROS-HIMS Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
