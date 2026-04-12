import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgccIcon } from '../ngcc-icons/ngcc-icon';
import type { NgccIconNameType } from '../ngcc-icons/icons';

/**
 * A single navigable link inside <ngcc-side-nav>.
 *
 * Renders as:
 *   <li class="cds--side-nav__item [cds--side-nav__item--icon]">
 *     <a class="cds--side-nav__link [cds--side-nav__link--current]">
 *       [icon]
 *       <span>Label</span>
 *     </a>
 *   </li>
 *
 * Usage:
 *   <ngcc-side-nav-item href="/dashboard" iconName="home" [active]="true">
 *     Dashboard
 *   </ngcc-side-nav-item>
 */
@Component({
  selector: 'ngcc-side-nav-item',
  standalone: true,
  imports: [NgccIcon],
  templateUrl: './ngcc-side-nav-item.html',
  styleUrls: ['./ngcc-side-nav-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccSideNavItem {
  /** Navigation URL */
  readonly href = input('#');
  /** Marks this link as the active / current page */
  readonly active = input(false);
  /** Optional title attribute for the anchor */
  readonly title = input('');
  /** Optional icon placed before the link text */
  readonly iconName = input<NgccIconNameType | undefined>(undefined);

  readonly itemClick = output<Event>();

  readonly itemClasses = computed(() => ['cds--side-nav__item'].filter(Boolean).join(' '));

  readonly linkClasses = computed(() =>
    ['cds--side-nav__link', this.active() ? 'cds--side-nav__link--current' : '']
      .filter(Boolean)
      .join(' '),
  );

  onClick(event: Event): void {
    this.itemClick.emit(event);
  }
}
