import { InjectionToken, type Signal } from '@angular/core';

/** Determines how the side-nav responds to activation. */
export type NgccSideNavVariant = 'default' | 'rail';

/**
 * Context provided by NgccSideNav to descendant components via DI.
 * Injected by NgccSideNavMenu so it can communicate back to the parent nav.
 */
export interface NgccSideNavContext {
  /** Current rail state — `true` when the nav is in compact icon-only mode. */
  readonly rail: Signal<boolean>;
  /** Expands the side navigation programmatically. */
  expand(): void;
}

/** Injection token for the side-nav context. */
export const NGCC_SIDE_NAV_CONTEXT = new InjectionToken<NgccSideNavContext>('NgccSideNavContext');
