import type { H3Event, EventHandlerRequest } from 'h3';
import type { User } from '../../prisma/generated/client';
import { createTestSession } from './testFixtures';

/**
 * Create a mock H3 event for testing API handlers.
 *
 * Provides minimal H3Event implementation needed for handler testing. Most
 * handlers only need headers, params, query, and body - this mock focuses
 * on those essential properties.
 *
 * **Supported Options:**
 * - method: HTTP method (GET/POST/PUT/DELETE)
 * - headers: Request headers (including auth cookies)
 * - body: Request body (for POST/PUT)
 * - params: Route parameters (from [id] patterns)
 * - query: Query string parameters
 *
 * **Usage:** For authenticated requests, use createAuthEvent() instead.
 *
 * @param options - Event configuration options
 * @returns Minimal H3Event mock for testing
 * @see createAuthEvent for authenticated requests
 *
 * @example
 * ```typescript
 * // Unauthenticated request (for testing 401)
 * const event = createMockEvent({})
 * await expect(handler(event)).rejects.toMatchObject({ statusCode: 401 })
 *
 * // Request with params
 * const event = createMockEvent({
 *   params: { id: 'todo-123' },
 *   headers: { cookie: '...' }
 * })
 * ```
 */
export function createMockEvent(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, string>;
}): H3Event<EventHandlerRequest> {
  const { method = 'GET', headers = {}, body, params = {} } = options;

  // Store body and params for getRouterParam and readBody
  const context: Record<string, unknown> = {
    _body: body,
    _params: params,
  };

  // Minimal H3Event mock
  const event = {
    // Node.js request/response (not used by our handlers)
    node: {
      req: {},
      res: {},
    },

    // Headers (used by serverAuth for session cookie)
    headers: new Headers(headers),

    // Method
    method,

    // Context storage (used by H3 utilities)
    context,

    // Path (not critical for our tests)
    path: '/',

    // Minimal event properties
    handled: false,
  } as unknown as H3Event<EventHandlerRequest>;

  return event;
}

/**
 * Create an authenticated mock H3 event.
 *
 * Convenience wrapper that creates a session for the user and includes the
 * session token in the cookie header. Use this for testing authenticated
 * endpoints instead of manually creating sessions and cookies.
 *
 * **Automatic:**
 * - Creates test session for user
 * - Adds session cookie to headers
 * - Merges with any custom headers
 *
 * **Performance:** ~50ms (includes session creation)
 *
 * @param user - User object to authenticate as
 * @param options - Additional event options (merged with auth cookie)
 * @returns Authenticated H3Event mock
 * @see createMockEvent for unauthenticated requests
 *
 * @example
 * ```typescript
 * // Simple authenticated request
 * const user = await createTestUser()
 * const event = await createAuthEvent(user)
 * const response = await handler(event)
 *
 * // With body (POST/PUT)
 * const event = await createAuthEvent(user, {
 *   method: 'POST',
 *   body: { title: 'New Todo' }
 * })
 *
 * // With route params
 * const event = await createAuthEvent(user, {
 *   params: { id: todo.id }
 * })
 *
 * // With query params
 * const event = await createAuthEvent(user, {
 *   query: { filter: 'active', sort: 'date' }
 * })
 * ```
 */
export async function createAuthEvent(
  user: User,
  options?: Partial<Parameters<typeof createMockEvent>[0]>,
): Promise<H3Event<EventHandlerRequest>> {
  const session = await createTestSession(user);

  return createMockEvent({
    ...options,
    headers: {
      ...options?.headers,
      cookie: `better-auth.session_token=${session.token}`,
    },
  });
}
