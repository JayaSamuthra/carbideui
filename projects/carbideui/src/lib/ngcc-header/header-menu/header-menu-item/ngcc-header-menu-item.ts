import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * A single item inside an <ngcc-header-menu> dropdown.
 * Renders as <li role="none"><a role="menuitem">…</a></li>
 */
@Component({
  selector: 'ngcc-header-menu-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ngcc-header-menu-item.html',
  styleUrls: ['./ngcc-header-menu-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderMenuItem implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['href']) this._href.set(changes['href'].currentValue ?? '/');
    if (changes['routerLink']) this._routerLink.set(changes['routerLink'].currentValue ?? null);
    if (changes['isCurrentPage'])
      this._isCurrentPage.set(changes['isCurrentPage'].currentValue ?? false);
    if (changes['disabled']) this._disabled.set(changes['disabled'].currentValue ?? false);
  }

  @Input() href = '/';
  private readonly _href = signal('/');
  @Input() routerLink?: string | string[] | null = null;
  private readonly _routerLink = signal<string | string[] | null>(null);
  @Input() isCurrentPage = false;
  private readonly _isCurrentPage = signal(false);
  @Input() disabled = false;
  private readonly _disabled = signal(false);

  @Output() itemClick = new EventEmitter<Event>();

  readonly linkClasses = computed(() =>
    ['cds--header__menu-item', this._isCurrentPage() ? 'cds--header__menu-item--current' : '']
      .filter(Boolean)
      .join(' '),
  );

  readonly resolvedHref = computed(() => {
    if (this._routerLink()) return this._routerLink();
    return this._href();
  });

  onClick(event: Event): void {
    if (this._disabled()) {
      event.preventDefault();
      return;
    }
    this.itemClick.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this._disabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.itemClick.emit(event);
    }
  }
}
