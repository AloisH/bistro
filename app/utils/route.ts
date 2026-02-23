const LOCALE_PREFIX_RE = /^\/fr(?=\/|$)/;

/**
 * Check if path matches public route pattern (supports wildcards)
 * Strips known locale prefixes before matching so /fr/blog matches /blog.
 */
export function isPublicRoute(path: string, publicRoutes: string[]): boolean {
  const cleanPath = path.replace(LOCALE_PREFIX_RE, '') || '/';
  return publicRoutes.some((route) => {
    if (route.endsWith('/*')) {
      const basePath = route.slice(0, -2);
      return cleanPath === basePath || cleanPath.startsWith(`${basePath}/`);
    }
    return cleanPath === route;
  });
}
