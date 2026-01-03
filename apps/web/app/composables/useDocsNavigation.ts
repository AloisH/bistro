import type { NavigationMenuItem } from '@nuxt/ui';

interface NavItem {
  _path: string;
  title: string;
  navigation?: {
    title?: string;
    icon?: string;
    order?: number;
  };
  children?: NavItem[];
}

export function useDocsNavigation() {
  const { data, status, error } = useFetch<NavItem[]>('/api/docs/navigation', {
    key: 'docs-navigation',
  });

  const navItems = computed<NavigationMenuItem[][]>(() => {
    if (!data.value) return [];

    // Icon defaults per section
    const iconMap: Record<string, string> = {
      'getting-started': 'i-lucide-rocket',
      'features': 'i-lucide-star',
      'deployment': 'i-lucide-cloud',
    };

    const items = data.value
      .filter(item => !item._path.endsWith('/index'))
      .map((item) => {
        const section = item._path.split('/')[2] || 'default';
        const icon = item.navigation?.icon || iconMap[section] || 'i-lucide-file';

        return {
          label: item.navigation?.title || item.title,
          icon,
          to: item.children ? undefined : item._path,
          children: item.children
            ?.sort((a, b) => {
              const orderA = a.navigation?.order ?? 999;
              const orderB = b.navigation?.order ?? 999;
              return orderA - orderB;
            })
            .map(child => ({
              label: child.navigation?.title || child.title,
              to: child._path,
            })),
        };
      });

    return [items];
  });

  return { navigation: navItems, status, error };
}
