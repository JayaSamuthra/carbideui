import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * A single item inside an <ngcc-header-menu> dropdown.
 * Renders as <li role="none"><a role="menuitem">…</a></li>
 */
@Component({
  selector: 'ngcc-header-menu-item',
  standalone: true,
  imports: [],
  templateUrl: './ngcc-header-menu-item.html',
  styleUrls: ['./ngcc-header-menu-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderMenuItem {
  readonly href = input('/');
  readonly isCurrentPage = input(false);
  readonly disabled = input(false);

  readonly itemClick = output<Event>();

  readonly linkClasses = computed(() =>
    ['cds--header__menu-item', this.isCurrentPage() ? 'cds--header__menu-item--current' : '']
      .filter(Boolean)
      .join(' '),
  );

  onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.itemClick.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.itemClick.emit(event);
    }
  }
}
