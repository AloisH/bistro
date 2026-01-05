# Dashboard Sidebar Test Guide

## How to Test the Sidebar

### 1. Start the Development Server

```bash
cd /home/alois/bistro
bun dev
```

The server should start on http://localhost:3001/

### 2. Log In to Your Account

- Navigate to http://localhost:3001/auth/login
- Log in with your credentials

### 3. Test the Dashboard Sidebar

#### Dashboard Page

- Navigate to http://localhost:3001/org/[slug]/dashboard
- You should see:
  - A sidebar on the left side
  - Navigation menu with Dashboard, Profile, and Settings
  - User avatar and name in the footer
  - Search button at the top

#### Profile Page

- Navigate to http://localhost:3001/profile
- You should see:
  - The same sidebar as on the dashboard page
  - Profile management content on the right
  - All sidebar features working

#### Settings Page

- Navigate to http://localhost:3001/org/[slug]/dashboard/settings
- You should see:
  - The sidebar with Settings highlighted
  - Theme switching options
  - All sidebar features working

### 4. Test Sidebar Features

#### Resizing

- Hover over the right edge of the sidebar
- Drag to resize the sidebar
- Should resize smoothly

#### Collapsing

- Drag near the left edge of the screen
- Sidebar should collapse
- Click on icons to navigate while collapsed

#### Navigation

- Click on Dashboard, Profile, Settings links
- Should navigate to the correct pages
- Active link should be highlighted

### 5. Test Non-Dashboard Pages

- Navigate to the homepage http://localhost:3001/
- Should see the regular layout (no sidebar)
- Header and footer should be visible

## Expected Behavior

✅ Dashboard pages should show the sidebar
✅ Non-dashboard pages should show the regular layout
✅ Sidebar should be resizable and collapsible
✅ Navigation should work correctly
✅ User session data should be displayed in sidebar footer

## Troubleshooting

If the sidebar is not visible:

1. Check that you're logged in
2. Make sure you're on a dashboard route (/org/[slug]/dashboard, /profile, /org/[slug]/dashboard/settings)
3. Check the browser console for errors
4. Verify that the page has `definePageMeta({ layout: 'dashboard' })`

## Technical Details

- **Layout System**: Uses Nuxt's built-in layout system
- **Authentication**: Protected by middleware in `apps/web/app/middleware/auth.global.ts`
- **Sidebar Component**: Uses `@nuxt/ui` DashboardSidebar component
- **Routing**: Dashboard routes are defined in `apps/web/app/pages/org/[slug]/dashboard/`
