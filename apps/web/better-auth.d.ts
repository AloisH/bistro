import 'better-auth/client';
import 'better-auth';

declare module 'better-auth/client' {
  interface Session {
    user: User;
    session?: {
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
    };
  }

  interface User {
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
}

declare module 'better-auth' {
  interface Session {
    user: User;
    session?: {
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
    };
  }

  interface User {
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
}
