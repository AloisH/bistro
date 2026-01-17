/**
 * Extract user-friendly error message from API errors
 */
export function getErrorMessage(e: unknown, defaultMessage = 'An error occurred. Please try again.'): string {
  // Network error
  if (e instanceof TypeError && e.message.includes('fetch')) {
    return 'Network error. Check your connection.';
  }

  // API error with status
  const err = e as { status?: number; data?: { message?: string } };

  if (err?.status === 429) {
    return 'Too many attempts. Try again later.';
  }

  if (err?.status === 400) {
    return err.data?.message || 'Invalid request.';
  }

  if (err?.status === 401) {
    return 'Invalid credentials.';
  }

  if (err?.status === 403) {
    return 'Access denied.';
  }

  if (err?.status === 404) {
    return 'Not found.';
  }

  if (err?.status && err.status >= 500) {
    return 'Server error. Try again later.';
  }

  // Check for message in error data
  if (err?.data?.message) {
    return err.data.message;
  }

  return defaultMessage;
}
