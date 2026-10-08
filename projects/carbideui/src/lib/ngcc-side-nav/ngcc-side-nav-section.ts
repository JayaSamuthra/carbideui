import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * A simple labeled section within <ngcc-side-nav>.
 *
 * This is used for admin shell groupings like "BSS" / "OSS" where a divider is not enough,
 * but a labeled heading helps users understand the grouping.
 */
@Component({
  selector: 'ngcc-side-nav-section',
  standalone: true,
  template: `
    <li class="cds--side-nav__section" role="presentation">
      <span class="cds--side-nav__section-title">{{ label }}</span>
    </li>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
    `
      .cds--side-nav__section {
        display: flex;
        align-items: center;
        min-height: 2rem;
        padding: 0.5rem 1rem 0.25rem;
      }
    `,
    `
      .cds--side-nav__section-title {
        color: var(--cds-text-secondary, #525252);
        font-size: 0.625rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        line-height: 1.25rem;
        text-transform: uppercase;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccSideNavSection {
  @Input() label = '';
}
