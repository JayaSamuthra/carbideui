import { describe, expect, it } from 'vitest';
import {
  billingIcons,
  cloudInfrastructureIcons,
  commonUiIcons,
  computeIcons,
  kubernetesIcons,
  monitoringIcons,
  networkingIcons,
  operationsIcons,
  securityIcons,
  storageIcons,
} from './categories';
import { ICONS } from './icons';

const SETS: Record<string, Record<string, { svg: string; viewBox: string }>> = {
  cloudInfrastructureIcons,
  computeIcons,
  networkingIcons,
  storageIcons,
  kubernetesIcons,
  securityIcons,
  monitoringIcons,
  billingIcons,
  operationsIcons,
  commonUiIcons,
};

// Icons that existed before the cloud icon sets were added; they must keep working.
const LEGACY_NAMES = [
  'add',
  'close',
  'edit',
  'view',
  'hide',
  'delete',
  'warn',
  'error',
  'calendar',
  'copy',
  'chevron_left',
  'chevron_right',
  'chevron_down',
  'chevron_up',
  'checkmark',
  'search',
  'sort_icon',
  'arrow_up',
  'arrow_down',
  'info_filled',
  'error_filled',
  'warning_filled',
  'success_filled',
  'star',
  'cpu',
  'memory',
  'network',
  'disk',
  'services',
  'notification',
  'configuration',
  'home',
  'renew',
  'customer',
  'user',
  'user_multi',
  'user_avatar',
  'user_admin',
  'location',
  'information',
  'menu',
  'app_switcher',
  'overflow_menu_vertical',
  'billing',
  'reports',
  'marketplace',
  'support',
  'license',
  'activity',
  'globe',
  'sign_out',
  'theme',
  'filter',
  'download',
  'export',
  'upload',
  'settings_adjust',
  'time',
  'document',
  'link',
  'save',
  'refresh',
  'lock',
  'unlock',
  'launch',
  'light',
  'dark',
  'email',
  'tag',
  'cloud',
  'server',
];

describe('ICONS registry', () => {
  it('keeps every pre-existing icon name', () => {
    for (const name of LEGACY_NAMES) expect(ICONS, name).toHaveProperty(name);
  });

  it('has no name defined in more than one category or in the core set', () => {
    const seen = new Map<string, string>();
    for (const [setName, set] of Object.entries(SETS)) {
      for (const name of Object.keys(set)) {
        expect(seen.has(name), `${name} in ${setName} and ${seen.get(name)}`).toBe(false);
        expect(LEGACY_NAMES.includes(name), `${name} shadows a core icon`).toBe(false);
        seen.set(name, setName);
      }
    }
    expect(Object.keys(ICONS).length).toBe(seen.size + LEGACY_NAMES.length);
  });

  it('uses snake_case names', () => {
    for (const name of Object.keys(ICONS)) expect(name).toMatch(/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/);
  });

  it('has valid, safe SVG content for every icon', () => {
    for (const [name, def] of Object.entries(ICONS)) {
      expect(def.viewBox, name).toMatch(/^\d+ \d+ \d+ \d+$/);
      expect(def.svg.length, name).toBeGreaterThan(0);
      expect(def.svg, name).not.toMatch(
        /<(script|style|defs|image|use|svg)\b|\son\w+=|class=|xmlns/,
      );
      const doc = new DOMParser().parseFromString(
        `<svg xmlns="http://www.w3.org/2000/svg">${def.svg}</svg>`,
        'image/svg+xml',
      );
      expect(doc.querySelector('parsererror'), name).toBeNull();
      expect(
        doc.querySelectorAll('path,circle,rect,polygon,line,polyline').length,
        name,
      ).toBeGreaterThan(0);
    }
  });

  it('new cloud icons use the Carbon 32x32 viewBox', () => {
    for (const set of Object.values(SETS)) {
      for (const [name, def] of Object.entries(set)) expect(def.viewBox, name).toBe('0 0 32 32');
    }
  });

  it('registers at least 170 cloud icons across the 10 categories', () => {
    expect(Object.keys(SETS).length).toBe(10);
    const count = Object.values(SETS).reduce((n, s) => n + Object.keys(s).length, 0);
    expect(count).toBeGreaterThanOrEqual(170);
  });
});
