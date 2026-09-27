// ─── Enums ────────────────────────────────────────────────────────────────────
// Using const objects instead of TS enums for Node strip-only TypeScript support.

export const WeddingStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type WeddingStatus =
  (typeof WeddingStatus)[keyof typeof WeddingStatus];

export const RSVPStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
} as const;
export type RSVPStatus = (typeof RSVPStatus)[keyof typeof RSVPStatus];

export const UserRole = {
  ADMIN: 'ADMIN',
  PLANNER: 'PLANNER',
  PLANNER_STAFF: 'PLANNER_STAFF',
  COUPLE: 'COUPLE',
  GUEST: 'GUEST',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;
export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const ChecklistPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
export type ChecklistPriority =
  (typeof ChecklistPriority)[keyof typeof ChecklistPriority];

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  meta: ApiPaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    details: ApiErrorDetail[];
  };
}

export interface HealthCheckResponse {
  status: string;
  database: string;
  timestamp: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

// ─── Wedding ──────────────────────────────────────────────────────────────────

export interface CreateWeddingRequest {
  title: string;
  weddingDate?: string;
  timezone?: string;
}

export interface UpdateWeddingRequest {
  title?: string;
  weddingDate?: string | null;
  timezone?: string;
  status?: WeddingStatus;
  customDomain?: string | null;
}

export interface WeddingResponse {
  id: string;
  slug: string;
  title: string;
  weddingDate: string | null;
  timezone: string;
  status: WeddingStatus;
  publishedAt: string | null;
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Members ──────────────────────────────────────────────────────────────────

export interface InviteMemberRequest {
  email: string;
  role: UserRole;
}

export interface UpdateMemberRoleRequest {
  role: UserRole;
}

export interface WeddingMemberResponse {
  id: string;
  weddingId: string;
  userId: string;
  role: UserRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface UpdateWeddingProfileRequest {
  brideName?: string | null;
  groomName?: string | null;
  proposalStory?: string | null;
  loveStory?: string | null;
  weddingHashtag?: string | null;
  ceremonyName?: string | null;
  ceremonyAddress?: string | null;
  ceremonyTime?: string | null;
  receptionName?: string | null;
  receptionAddress?: string | null;
  receptionTime?: string | null;
  dressCode?: string | null;
}

export interface WeddingProfileResponse {
  id: string;
  weddingId: string;
  brideName: string | null;
  groomName: string | null;
  proposalStory: string | null;
  loveStory: string | null;
  weddingHashtag: string | null;
  ceremonyName: string | null;
  ceremonyAddress: string | null;
  ceremonyTime: string | null;
  receptionName: string | null;
  receptionAddress: string | null;
  receptionTime: string | null;
  dressCode: string | null;
  createdAt: string;
  updatedAt: string;
}
