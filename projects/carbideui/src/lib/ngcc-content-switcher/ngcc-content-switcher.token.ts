import { InjectionToken } from '@angular/core';

export interface NgccContentSwitcherContext {
  selectOption(option: unknown): void;
}

export const NGCC_CONTENT_SWITCHER = new InjectionToken<NgccContentSwitcherContext>(
  'NGCC_CONTENT_SWITCHER',
);
