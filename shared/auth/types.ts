export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  onboardingCompleted: boolean;
  bio?: string | null;
  company?: string | null;
  useCase?: string | null;
  emailNotifications: boolean;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
  currentOrganizationId?: string | null;
}
