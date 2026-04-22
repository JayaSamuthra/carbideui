import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import { destroyPlatform } from '@angular/core';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

import { expect } from 'vitest';

/**
 * -------------------------------------------------------
 * Angular Testing Environment Setup
 * -------------------------------------------------------
 */

// Destroy existing Angular platform (important for Vitest single-thread mode)
try {
  destroyPlatform();
} catch {
  // Ignore if no platform exists
}

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);

/**
 * -------------------------------------------------------
 * Custom Accessibility Matcher (axe-core)
 * -------------------------------------------------------
 */

expect.extend({
  toHaveNoViolations(results: any) {
    const pass = results.violations.length === 0;

    return {
      pass,
      message: () =>
        pass
          ? 'No accessibility violations'
          : `Accessibility violations found:\n\n${JSON.stringify(
              results.violations,
              null,
              2
            )}`,
    };
  },
});

/**
 * Extend Vitest typings for custom matcher
 */
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}

/**
 * -------------------------------------------------------
 * Global Mocks (JSDOM gaps)
 * -------------------------------------------------------
 */

// ResizeObserver mock (used in charts, layout, tooltips)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// SVG text measurement mock
Object.defineProperty(
  window.SVGElement.prototype,
  'getComputedTextLength',
  {
    value: () => 0,
    writable: true,
  }
);