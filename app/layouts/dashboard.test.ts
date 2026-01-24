import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardLayout from './dashboard.vue';

describe('DashboardLayout', () => {
  it('should render the layout with sidebar', () => {
    const wrapper = mount(DashboardLayout, {
      global: {
        stubs: {
          UDashboardGroup: true,
          UDashboardSidebar: true,
          AppLogo: true,
          UIcon: true,
          UButton: true,
          UKbd: true,
          UNavigationMenu: true,
        },
      },
    });

    expect(wrapper.find('udashboardgroup-stub').exists()).toBe(true);
    expect(wrapper.find('udashboardsidebar-stub').exists()).toBe(true);
  });

  it('should have proper slot structure', () => {
    const wrapper = mount(DashboardLayout, {
      slots: {
        default: '<div>Test Content</div>',
      },
      global: {
        stubs: {
          UDashboardGroup: true,
          UDashboardSidebar: true,
          AppLogo: true,
          UIcon: true,
          UButton: true,
          UKbd: true,
          UNavigationMenu: true,
        },
      },
    });

    expect(wrapper.html()).toContain('Test Content');
  });
});
