-- CreateEnum
CREATE TYPE "CapaType" AS ENUM ('CORRECTIVE', 'PREVENTIVE');

-- CreateEnum
CREATE TYPE "CapaPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CapaStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ControlEffectiveness" AS ENUM ('EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE');

-- CreateEnum
CREATE TYPE "ControlStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ReviewOutcome" AS ENUM ('APPROVED', 'REVISION_REQUIRED');

-- CreateEnum
CREATE TYPE "DisseminationStatus" AS ENUM ('SCHEDULED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "IncidentAttachment" DROP CONSTRAINT "IncidentAttachment_incidentId_fkey";

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "closedById" INTEGER,
ADD COLUMN     "closureSummary" TEXT,
ADD COLUMN     "investigationReviewStatus" TEXT DEFAULT 'PENDING',
ADD COLUMN     "investigation_findings" TEXT,
ADD COLUMN     "investigation_review_comment" TEXT;

-- CreateTable
CREATE TABLE "CapaAction" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "actionType" "CapaType" NOT NULL DEFAULT 'CORRECTIVE',
    "priority" "CapaPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "actionOwnerId" INTEGER NOT NULL,
    "status" "CapaStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "evidenceNotes" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" INTEGER,
    "verificationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapaAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentControl" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "controlType" TEXT NOT NULL,
    "effectiveness" "ControlEffectiveness" NOT NULL DEFAULT 'PARTIALLY_EFFECTIVE',
    "status" "ControlStatus" NOT NULL DEFAULT 'PLANNED',
    "failureReason" TEXT,
    "requiredImprovement" TEXT,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagementReview" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "outcome" "ReviewOutcome" NOT NULL DEFAULT 'APPROVED',
    "lessonsLearned" TEXT NOT NULL,
    "outcomeComments" TEXT NOT NULL,
    "followUpMonitoring" TEXT NOT NULL,
    "reviewedById" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagementReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonsDissemination" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "audience" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" "DisseminationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonsDissemination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentAuditLog" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "changes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagementReview_incidentId_key" ON "ManagementReview"("incidentId");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentAttachment" ADD CONSTRAINT "IncidentAttachment_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaAction" ADD CONSTRAINT "CapaAction_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaAction" ADD CONSTRAINT "CapaAction_actionOwnerId_fkey" FOREIGN KEY ("actionOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaAction" ADD CONSTRAINT "CapaAction_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentControl" ADD CONSTRAINT "IncidentControl_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagementReview" ADD CONSTRAINT "ManagementReview_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagementReview" ADD CONSTRAINT "ManagementReview_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonsDissemination" ADD CONSTRAINT "LessonsDissemination_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentAuditLog" ADD CONSTRAINT "IncidentAuditLog_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentAuditLog" ADD CONSTRAINT "IncidentAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
