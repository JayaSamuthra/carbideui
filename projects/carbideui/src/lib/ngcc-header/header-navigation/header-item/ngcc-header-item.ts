import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * A single navigation link inside <ngcc-header-navigation>.
 * Renders as <li role="none"><a role="menuitem">…</a></li>
 *
 * <ngcc-header-item href="/dashboard" [isCurrentPage]="true">Dashboard</ngcc-header-item>
 */
@Component({
  selector: 'ngcc-header-item',
  standalone: true,
  imports: [],
  templateUrl: './ngcc-header-item.html',
  styleUrls: ['./ngcc-header-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderItem {
  /** Navigation URL */
  readonly href = input('/');
  /** Marks this link as the active / current page */
  readonly isCurrentPage = input(false);
  /** Tab index override */
  readonly tabIndex = input(0);

  readonly itemClick = output<Event>();

  readonly linkClasses = computed(() =>
    ['cds--header__menu-item', this.isCurrentPage() ? 'cds--header__menu-item--current' : '']
      .filter(Boolean)
      .join(' '),
  );

  onClick(event: Event): void {
    this.itemClick.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.itemClick.emit(event);
    }
  }
}
