import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLogo from './AppLogo.vue'

describe('AppLogo', () => {
  it('renders logo SVG', () => {
    const wrapper = mount(AppLogo)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('has correct viewBox dimensions', () => {
    const wrapper = mount(AppLogo)
    const svg = wrapper.find('svg')
    expect(svg.attributes('viewBox')).toBe('0 0 1020 200')
  })

  it('has correct width and height', () => {
    const wrapper = mount(AppLogo)
    const svg = wrapper.find('svg')
    expect(svg.attributes('width')).toBe('1020')
    expect(svg.attributes('height')).toBe('200')
  })

  it('renders multiple path elements', () => {
    const wrapper = mount(AppLogo)
    const paths = wrapper.findAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })
})
