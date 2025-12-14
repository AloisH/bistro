import 'better-auth/client';

declare module 'better-auth/client' {
  interface Session {
    user: User;
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
