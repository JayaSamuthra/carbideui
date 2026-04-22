import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A visual separator between groups of <ngcc-side-nav-item> / <ngcc-side-nav-menu> elements.
 *
 * Renders as <li class="cds--side-nav__divider" role="separator" aria-hidden="true">.
 *
 * Usage:
 *   <ngcc-side-nav-item href="/home">Home</ngcc-side-nav-item>
 *   <ngcc-side-nav-divider />
 *   <ngcc-side-nav-item href="/help">Help</ngcc-side-nav-item>
 */
@Component({
  selector: 'ngcc-side-nav-divider',
  standalone: true,
  imports: [],
  template: '<li class="cds--side-nav__divider" role="separator" aria-hidden="true"></li>',
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccSideNavDivider {}
