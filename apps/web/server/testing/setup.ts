/**
 * Test setup - provides globals that are auto-imported by Nuxt/H3
 *
 * Only defines createError if not already available (Nuxt provides it)
 */

// Make this file a module so declare global works
export {};

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

// Type declaration for test globals
declare global {
  var createError: ((input: string | ErrorOptions) => H3Error) | undefined;
}

// Only define createError if not already available (Nuxt auto-imports it)
if (typeof globalThis.createError === 'undefined') {
  globalThis.createError = (input: string | ErrorOptions): H3Error => {
    if (typeof input === 'string') {
      return new H3Error(input);
    }
    return new H3Error(input.message || input.statusMessage || 'Error', input);
  };
}
