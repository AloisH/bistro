import type { EventHandlerRequest, H3Event } from 'h3';
import type { ZodSchema } from 'zod';
import { serverAuth } from '../features/auth/auth-session';

/**
 * API Handler Context - passed to all handlers
 */
export interface ApiHandlerContext<TBody = unknown> {
  event: H3Event<EventHandlerRequest>;
  userId: string;
  body?: TBody;
}

/**
 * API Handler Options
 */
export interface ApiHandlerOptions {
  requiresAuth?: boolean;
  logContext?: string;
}

/**
 * Basic API handler with authentication
 * Use for endpoints without request body (GET, DELETE)
 */
export function defineApiHandler<TReturn>(
  handler: (context: ApiHandlerContext) => Promise<TReturn>,
  options: ApiHandlerOptions = {},
): (event: H3Event<EventHandlerRequest>) => Promise<TReturn> {
  const { requiresAuth = true, logContext } = options;

  return defineEventHandler(async (event) => {
    try {
      // Auth check
      if (requiresAuth) {
        const session = await serverAuth().getSession({ headers: event.headers });
        if (!session?.user) {
          throw createError({
            statusCode: 401,
            message: 'Unauthorized',
          });
        }

        const context: ApiHandlerContext = {
          event,
          userId: session.user.id,
        };

        return await handler(context);
      }

      // No auth required (rare)
      const context: ApiHandlerContext = {
        event,
        userId: '',
      };

      return await handler(context);
    } catch (error) {
      if (logContext) {
        console.error(`[${logContext}]`, error);
      }
      throw error;
    }
  });
}

/**
 * API handler with request body validation
 * Use for endpoints with request body (POST, PUT)
 */
export function defineValidatedApiHandler<TBody, TReturn>(
  schema: ZodSchema<TBody>,
  handler: (context: ApiHandlerContext<TBody>) => Promise<TReturn>,
  options: ApiHandlerOptions = {},
): (event: H3Event<EventHandlerRequest>) => Promise<TReturn> {
  const { requiresAuth = true, logContext } = options;

  return defineEventHandler(async (event) => {
    try {
      // Auth check
      if (requiresAuth) {
        const session = await serverAuth().getSession({ headers: event.headers });
        if (!session?.user) {
          throw createError({
            statusCode: 401,
            message: 'Unauthorized',
          });
        }

        // Read and validate body
        const rawBody = await readBody(event);
        const validationResult = schema.safeParse(rawBody);

        if (!validationResult.success) {
          throw createError({
            statusCode: 400,
            message: 'Validation failed',
            data: validationResult.error.issues,
          });
        }

        const context: ApiHandlerContext<TBody> = {
          event,
          userId: session.user.id,
          body: validationResult.data,
        };

        return await handler(context);
      }

      // No auth required (rare)
      const rawBody = await readBody(event);
      const validationResult = schema.safeParse(rawBody);

      if (!validationResult.success) {
        throw createError({
          statusCode: 400,
          message: 'Validation failed',
          data: validationResult.error.issues,
        });
      }

      const context: ApiHandlerContext<TBody> = {
        event,
        userId: '',
        body: validationResult.data,
      };

      return await handler(context);
    } catch (error) {
      if (logContext) {
        console.error(`[${logContext}]`, error);
      }
      throw error;
    }
  });
}
