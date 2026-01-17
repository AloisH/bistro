export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate',
    },
    navigationMenu: {
      slots: {
        link: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
      },
    },
    dashboardPanel: {
      slots: {
        root: 'relative flex flex-col min-w-0 h-svh max-h-svh lg:not-last:border-e lg:not-last:border-default',
      },
    },
  },
});
