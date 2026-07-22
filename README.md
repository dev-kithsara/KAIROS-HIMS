<div align="center">

<img src="https://img.shields.io/badge/KAIROS-HIMS-00B4A0?style=for-the-badge&logoColor=white" alt="KAIROS HIMS Logo" height="60"/>

# 🏥 KAIROS HIMS
### Hospital Incident Management System

*A production-grade, full-stack, role-based Incident & Risk Management platform engineered for healthcare environments.*

[![React](https://img.shields.io/badge/React_18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js_20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma_5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents
- [✨ Overview](#-overview)
- [🛡️ Key Features](#️-key-features)
- [🔄 Incident Lifecycle](#-incident-lifecycle)
- [👥 User Roles & Permissions](#-user-roles--permissions)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Database Migrations](#3-database-migrations)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [📈 Project Roadmap](#-project-roadmap)
- [📄 License](#-license)

---

## ✨ Overview

**KAIROS HIMS** is a modern, enterprise healthcare incident and risk management platform. It empowers frontline hospital staff to quickly report safety incidents with file attachments, department managers to review and manage multi-stage investigation workflows, and investigators to perform root-cause analysis — ensuring patient safety and regulatory compliance.

> **Why KAIROS?**  
> "Kairos" (καιρός) is an ancient Greek word meaning the *right, critical, or opportune moment*. KAIROS HIMS enables hospital care teams to act on safety risks at the exact moment it matters most.

---

## 🛡️ Key Features

### 📋 Staff Incident Submission
- **Structured Incident Reporting**: Staff can log incidents with severity level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), category, location, and detailed description.
- **Evidence Attachment Management**: Drag-and-drop file uploader supporting images (JPG, PNG) and documents (PDF) up to 5 files per incident.
- **Instant Status Tracking**: Real-time response confirmation with unique Incident Tracking IDs.

### 👔 Manager Approval & Workflow
- **Department-Scoped Dashboard**: Managers view real-time incidents specific to their department (ICU, ED, Surgery, Pediatrics).
- **Interactive State Transitions**:
  - **Accept**: Transition OPEN incidents to ACCEPTED for investigation.
  - **Reject**: Decline invalid reports with compulsory justification reasons.
  - **Assign Investigator**: Delegate ACCEPTED incidents to qualified investigators.
  - **Assign Action Owner**: Assign corrective action owners for INVESTIGATING incidents.
  - **Review & Close**: Formally review pending actions and close resolved incidents.

### 🔐 Data Safety & Type Safety
- **Full TypeScript Coverage**: End-to-end type safety across backend controllers, services, repositories, and frontend React Query hooks.
- **Prisma ORM**: Strict PostgreSQL database mapping with automatic migration tracking.
- **Zod Validation**: Input sanitization and schema enforcement on request payloads.

---

## 🔄 Incident Lifecycle

```
                     +------------------+
                     |    STAFF POST    |
                     |  Submit Incident |
                     +--------+---------+
                              |
                              v
                     +------------------+
                     |       OPEN       |
                     +--------+---------+
                              |
                   Manager Decision Point
                 +------------+------------+
                 |                         |
                 v                         v
        +-----------------+       +-----------------+
        |    ACCEPTED     |       |    REJECTED     |  (With Mandatory Reason)
        +--------+--------+       +-----------------+
                 |
      Assign Investigator
                 v
        +-----------------+
        |  INVESTIGATING  |  (Root Cause Analysis)
        +--------+--------+
                 |
        Assign Action Owner
                 v
        +-----------------+
        | PENDING_ACTION  |  (Corrective Action Implementation)
        +--------+--------+
                 |
           Manager Review
                 v
        +-----------------+
        |  UNDER_REVIEW   |
        +--------+--------+
                 |
           Formal Closure
                 v
        +-----------------+
        |     CLOSED      |  (Full Audit Trail Preserved)
        +-----------------+
```

---

## 👥 User Roles & Permissions

| Role | Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Frontline Staff** | Hospital-wide | Submit incident reports with file attachments, view submission feedback |
| **Department Manager** | Department-Scoped | Accept/Reject incidents, Assign Investigators & Action Owners, Review & Close |
| **Investigator** | Assigned Incidents | Conduct Root Cause Analysis (RCA), document findings |
| **Action Owner** | Assigned Actions | Execute and report status on corrective action plans |
| **System Admin** | Global System | Manage departments, user roles, system metrics, and audit logs |

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|        React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons       |
|            (TanStack React Query - React Router DOM v7 - Axios)         |
+------------------------------------+------------------------------------+
                                     |  HTTP / REST API
                                     v
+-------------------------------------------------------------------------+
|                             EXPRESS BACKEND                             |
|                   Node.js + TypeScript + Multer + Zod                   |
|   App Router (/api/v1/incidents & /api/incidents) -> Controller -> Service |
+------------------------------------+------------------------------------+
                                     |  Prisma Client Queries
                                     v
+-------------------------------------------------------------------------+
|                            DATABASE LAYER                               |
|                       PostgreSQL 16 Database                            |
|             (User, Department, Incident, IncidentAttachment)            |
+-------------------------------------------------------------------------+
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 + TypeScript 5.4 + Vite 8
- **Styling**: Tailwind CSS 3.4
- **State & Data Fetching**: TanStack React Query v5
- **Routing**: React Router DOM v7
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.19 + TypeScript 5.7
- **Database ORM**: Prisma ORM 5.22
- **Database**: PostgreSQL 16
- **File Uploads**: Multer 1.4
- **Validation**: Zod 3.24
- **Dev Server**: `tsx watch`

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v20.0 or higher
- **npm** v10.0 or higher
- **PostgreSQL** 16 instance running locally or on cloud

---

### 1. Backend Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables (Create .env file)
# Edit .env and update DATABASE_URL with your PostgreSQL credentials:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/kairos_hims?schema=public"

# 4. Run Prisma database migrations
npx prisma migrate deploy

# 5. Generate Prisma Client
npx prisma generate

# 6. Start backend development server (Runs on Port 8000)
npm run dev
```

---

### 2. Frontend Setup

```bash
# 1. Open a new terminal and navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite frontend development server (Runs on Port 5173)
npm run dev
```

Application URLs:
- **Manager Dashboard**: `http://localhost:5173/`
- **Staff Incident Submission Form**: `http://localhost:5173/submit-incident`
- **Backend API Base**: `http://localhost:8000/api/v1/incidents`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:rootpassword@localhost:5432/kairos_hims?schema=public"

# JWT Authentication
JWT_SECRET=kairos_super_secret_key_2026
JWT_EXPIRES_IN=7d

# AI Service Gateway (Phase 2)
AI_SERVICE_URL=http://localhost:8001
AI_API_KEY=internal_ai_key
```

---

## 📡 API Documentation

Base Endpoint: `http://localhost:8000/api/v1/incidents` (or `http://localhost:8000/api/incidents`)

| Method | Route | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Submit a new incident report | `multipart/form-data`: `title`, `description`, `severity`, `category`, `location`, `departmentId`, `evidence` (files) |
| `GET` | `/department/:departmentId` | Fetch incidents for a department | URL Param: `departmentId` (number) |
| `PATCH` | `/:id/accept` | Accept an OPEN incident | URL Param: `id` |
| `PATCH` | `/:id/reject` | Reject an OPEN incident | Body: `{ "reason": "Detailed rejection reason" }` |
| `PATCH` | `/:id/assign-investigator` | Assign investigator | Body: `{ "investigatorId": 3 }` |
| `PATCH` | `/:id/assign-action-owner` | Assign action owner | Body: `{ "actionOwnerId": 4 }` |
| `PATCH` | `/:id/review` | Mark incident as UNDER_REVIEW | URL Param: `id` |
| `PATCH` | `/:id/close` | Close an incident | URL Param: `id` |

---

## 🗄️ Database Schema

### Core Prisma Models:

```prisma
enum IncidentStatus {
  OPEN
  ACCEPTED
  REJECTED
  INVESTIGATING
  PENDING_ACTION
  UNDER_REVIEW
  CLOSED
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model Incident {
  id              Int                  @id @default(autoincrement())
  title           String
  description     String
  severity        Severity
  category        String
  location        String
  status          IncidentStatus       @default(OPEN)
  rejectionReason String?
  departmentId    Int
  department      Department           @relation(fields: [departmentId], references: [id])
  reporterId      Int
  reporter        User                 @relation("Reporter", fields: [reporterId], references: [id])
  investigatorId  Int?
  investigator    User?                @relation("Investigator", fields: [investigatorId], references: [id])
  actionOwnerId   Int?
  actionOwner     User?                @relation("ActionOwner", fields: [actionOwnerId], references: [id])
  attachments     IncidentAttachment[]
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
}

model IncidentAttachment {
  id         Int      @id @default(autoincrement())
  fileName   String
  filePath   String
  fileType   String
  incidentId Int
  incident   Incident @relation(fields: [incidentId], references: [id])
  uploadedAt DateTime @default(now())
}
```

---

## 📈 Project Roadmap

- [x] **Staff Incident Submission**: Incident creation form with file upload support & Zod validation
- [x] **Manager Approval Workflow**: Accept/Reject, Investigator assignment, Action Owner assignment, Review & Close
- [x] **Department Scoping**: Department-scoped querying and repository patterns
- [x] **PostgreSQL & Prisma Integration**: Safe migrations and full client generation
- [ ] **Authentication & RBAC**: JWT-based login, role guards, and middleware scoping
- [ ] **AI Incident Analytics (Phase 2)**: Severity prediction & vector similarity search

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**KAIROS HIMS** — *Empowering safer hospital care through real-time incident intelligence.*

</div>
