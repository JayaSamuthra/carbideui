import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * A navigable link nested inside <ngcc-side-nav-menu>.
 *
 * Renders as:
 *   <li class="cds--side-nav__menu-item">
 *     <a class="cds--side-nav__link [cds--side-nav__link--current]">
 *       <span>Label</span>
 *     </a>
 *   </li>
 *
 * Usage:
 *   <ngcc-side-nav-menu title="Settings">
 *     <ngcc-side-nav-menu-item href="/settings/profile" [active]="true">Profile</ngcc-side-nav-menu-item>
 *   </ngcc-side-nav-menu>
 */
@Component({
  selector: 'ngcc-side-nav-menu-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ngcc-side-nav-menu-item.html',
  styleUrls: ['./ngcc-side-nav-menu-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccSideNavMenuItem {
  /** Navigation URL */
  @Input() href = '#';
  /** Angular Router route target. When provided, it takes precedence over href. */
  @Input() routerLink?: string | string[] | null = null;
  /** Marks this link as the active / current page */
  @Input() active = false;
  /** Optional title attribute for the anchor */
  @Input() title = '';

  @Output() itemClick = new EventEmitter<Event>();

  readonly linkHref = (): string => {
    if (this.routerLink) {
      return Array.isArray(this.routerLink) ? this.routerLink.join('/') : this.routerLink;
    }
    return this.href ?? '#';
  };

  onClick(event: Event): void {
    this.itemClick.emit(event);
  }
}
