/**
 * Test setup - provides globals that are auto-imported by Nuxt/H3
 */

interface ErrorOptions {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  data?: unknown;
}

class H3Error extends Error {
  statusCode: number;
  statusMessage?: string;
  data?: unknown;

  constructor(message: string, options: ErrorOptions = {}) {
    super(message);
    this.statusCode = options.statusCode || 500;
    this.statusMessage = options.statusMessage;
    this.data = options.data;
    this.name = 'H3Error';
  }
}

function createError(input: string | ErrorOptions): H3Error {
  if (typeof input === 'string') {
    return new H3Error(input);
  }
  return new H3Error(input.message || input.statusMessage || 'Error', input);
}

// Make createError available globally for tests
// This mimics Nuxt's auto-import behavior
declare global {

  var createError: typeof createError;
}

globalThis.createError = createError;
