import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Horizontal navigation bar inside the header shell.
 * Project <ngcc-header-item> and <ngcc-header-menu> elements as children.
 *
 * DOM structure:
 *   <nav class="cds--header__nav" aria-label="…">
 *     <ul class="cds--header__menu-bar" role="menubar">
 *       <!-- projected items / menus -->
 *     </ul>
 *   </nav>
 */
@Component({
  selector: 'ngcc-header-navigation',
  standalone: true,
  imports: [],
  templateUrl: './ngcc-header-navigation.html',
  styleUrls: ['./ngcc-header-navigation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderNavigation {
  /** Accessible label for the <nav> landmark */
  readonly ariaLabel = input('Navigation');
}
