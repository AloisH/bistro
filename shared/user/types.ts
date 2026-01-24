/**
 * User types
 */

export interface OnboardingState {
  completed: boolean;
  steps: Record<string, boolean>;
  data: {
    bio?: string | null;
    company?: string | null;
    useCase?: string | null;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
}
