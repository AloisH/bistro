import { AsyncLocalStorage } from 'node:async_hooks';
import type { H3Event } from 'h3';
import type { LogContext } from './logger';

const storage = new AsyncLocalStorage<H3Event>();

export function getRequestContext(): Partial<LogContext> | undefined {
  const event = storage.getStore();
  return event?.context.logContext as Partial<LogContext> | undefined;
}

export function setRequestContext(updates: Partial<LogContext>) {
  const event = storage.getStore();
  if (event?.context.logContext) {
    Object.assign(event.context.logContext, updates);
  }
}

export function runWithContext<T>(event: H3Event, fn: () => T): T {
  return storage.run(event, fn);
}

// Helpers
export function addUserContext(user: { id: string; email?: string; role?: string }) {
  setRequestContext({
    userId: user.id,
    userRole: user.role,
  });
}

export function addOrgContext(org: { id: string; slug?: string }, role?: string) {
  setRequestContext({
    orgId: org.id,
    orgSlug: org.slug,
    orgRole: role,
  });
}

export function incrementDbQueries(count = 1) {
  const ctx = getRequestContext();
  if (ctx) {
    ctx.dbQueriesCount = (ctx.dbQueriesCount || 0) + count;
  }
}

export function addWarning(message: string, context?: Record<string, unknown>) {
  const ctx = getRequestContext();
  if (ctx) {
    if (!ctx.warnings) {
      ctx.warnings = [];
    }
    ctx.warnings.push({ message, context });
  }
}
