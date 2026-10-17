import type { Role, RequestStatus, NotificationType, NotificationStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// Re-export Prisma enums for convenient imports
// ─────────────────────────────────────────────
export type { Role, RequestStatus, NotificationType, NotificationStatus };

// ─────────────────────────────────────────────
// Extended Session User
// ─────────────────────────────────────────────
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
}

// ─────────────────────────────────────────────
// Request with relations (used in most views)
// ─────────────────────────────────────────────
export interface RequestWithRelations {
  id: string;
  reason: string;
  hospitalName: string;
  visitDate: Date;
  returnDate: Date | null;
  isEmergency: boolean;
  status: RequestStatus;
  proctorNote: string | null;
  qrCode: string | null;
  studentId: string;
  proctorId: string | null;
  escalatedAt: Date | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  student: {
    id: string;
    name: string;
    email: string;
    registerNo: string | null;
    department: string | null;
    phone: string | null;
  };
  proctor: {
    id: string;
    name: string;
    email: string;
  } | null;
  auditLogs: AuditLogEntry[];
}

// ─────────────────────────────────────────────
// Audit Log
// ─────────────────────────────────────────────
export interface AuditLogEntry {
  id: string;
  action: string;
  note: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    role: Role;
  };
}

// ─────────────────────────────────────────────
// Admin Stats
// ─────────────────────────────────────────────
export interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  escalatedRequests: number;
  approvalRate: number; // percentage
  avgResponseTimeMs: number | null;
  activeEmergencies: number;
}

// ─────────────────────────────────────────────
// API Response wrapper
// ─────────────────────────────────────────────
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─────────────────────────────────────────────
// Server Action Result
// ─────────────────────────────────────────────
export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };
