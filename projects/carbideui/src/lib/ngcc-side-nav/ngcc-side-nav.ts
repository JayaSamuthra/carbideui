import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';
import { NgccSideNavMenu } from './ngcc-side-nav-menu';
import { NGCC_SIDE_NAV_CONTEXT, NgccSideNavContext } from './ngcc-side-nav.types';
import { NgccButton } from '../ngcc-button/ngcc-button';

/**
 * Enterprise-grade Carbon Design System side navigation shell.
 *
 * Composition API — project children directly into this component:
 *   - <ngcc-side-nav-item>   — a single navigable link
 *   - <ngcc-side-nav-menu>   — a collapsible submenu with nested items
 *   - <ngcc-side-nav-divider> — a visual separator
 *
 * Full example:
 * ```html
 * <ngcc-side-nav ariaLabel="App navigation" [(expanded)]="sideNavOpen">
 *   <ngcc-side-nav-item href="/" iconName="home" [active]="true">Home</ngcc-side-nav-item>
 *
 *   <ngcc-side-nav-menu title="Settings" iconName="configuration">
 *     <ngcc-side-nav-menu-item href="/settings/profile">Profile</ngcc-side-nav-menu-item>
 *     <ngcc-side-nav-menu-item href="/settings/security">Security</ngcc-side-nav-menu-item>
 *   </ngcc-side-nav-menu>
 *
 *   <ngcc-side-nav-divider />
 *   <ngcc-side-nav-item href="/help" iconName="information">Help</ngcc-side-nav-item>
 * </ngcc-side-nav>
 * ```
 *
 * Pass `[allowExpansion]="true"` to render an expand/collapse toggle button in the footer.
 * Bind `[(expanded)]="open"` for two-way control of the expanded state.
 *
 * Rail mode: add `[rail]="true"` for the compact icon-only side-nav variant.
 * In rail mode, clicking a <ngcc-side-nav-menu> automatically expands the nav.
 */
@Component({
  selector: 'ngcc-side-nav',
  standalone: true,
  imports: [NgccButton],
  templateUrl: './ngcc-side-nav.html',
  styleUrls: ['./ngcc-side-nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cds--side-nav',
    '[class.cds--side-nav--expanded]': 'expanded()',
    '[class.cds--side-nav--hidden]': 'hidden()',
    '[class.cds--side-nav--rail]': 'rail()',
  },
  // Provide this component as NgccSideNavContext so projected NgccSideNavMenu
  // children can inject it via NGCC_SIDE_NAV_CONTEXT without a circular import.
  providers: [{ provide: NGCC_SIDE_NAV_CONTEXT, useExisting: NgccSideNav }],
})
export class NgccSideNav implements NgccSideNavContext {
  /** Accessible label for the <nav> landmark. */
  readonly ariaLabel = input('Side navigation');

  /**
   * Two-way bindable expanded/collapsed state.
   * Use `[(expanded)]="sideNavOpen"` in the parent.
   * Defaults to `true` (expanded).
   */
  readonly expanded = model(true);

  /** When `true`, hides the side-nav entirely (e.g. on mobile). */
  readonly hidden = input(false);

  /**
   * Rail mode: shows only icons when the nav is collapsed.
   * Requires icons on all items/menus for a good visual.
   */
  readonly rail = input(false);

  /**
   * When `true`, renders an expand/collapse toggle button in the side-nav footer.
   * Use with `[(expanded)]` for controlled expand/collapse behaviour.
   */
  readonly allowExpansion = input(false);

  /** Label shown on the expand toggle when collapsed. */
  readonly openLabel = input('Open navigation menu');

  /** Label shown on the collapse toggle when expanded. */
  readonly closeLabel = input('Close navigation menu');

  /**
   * All projected <ngcc-side-nav-menu> instances (direct + nested).
   * Used to auto-close open submenus when the nav collapses or enters rail mode.
   */
  private readonly menus = contentChildren(NgccSideNavMenu, { descendants: true });

  constructor() {
    // Track previous rail state so we can detect TRANSITIONS rather than reacting
    // to the current value on every change — this lets NgccSideNavMenu expand the
    // nav while in rail mode without immediately closing the menu it just opened.
    let prevRail = false;

    effect(() => {
      const expanded = this.expanded();
      const rail = this.rail();

      // Close all open submenus when:
      // 1. The nav collapses  (expanded → false)
      // 2. The nav enters rail mode for the first time  (rail false → true)
      // But NOT when: already in rail and the nav re-expands because a submenu was clicked
      if (!expanded || (rail && !prevRail)) {
        this.menus().forEach((menu) => menu.expanded.set(false));
      }

      prevRail = rail;
    });
  }

  // ── NgccSideNavContext implementation ───────────────────────────────────────

  /** Expands the side nav — called by NgccSideNavMenu when clicked in rail mode. */
  expand(): void {
    this.expanded.set(true);
  }

  // ── Public helpers ──────────────────────────────────────────────────────────

  toggle(): void {
    this.expanded.update((v) => !v);
  }
}
