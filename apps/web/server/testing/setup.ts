/**
 * Test setup - provides globals that are auto-imported by Nuxt/H3
 *
 * Only defines createError if not already available (Nuxt provides it)
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

// Only define createError if not already available (Nuxt auto-imports it)
const g = globalThis as unknown as Record<string, unknown>;
if (typeof g.createError === 'undefined') {
  g.createError = (input: string | ErrorOptions): H3Error => {
    if (typeof input === 'string') {
      return new H3Error(input);
    }
    return new H3Error(input.message || input.statusMessage || 'Error', input);
  };
}
