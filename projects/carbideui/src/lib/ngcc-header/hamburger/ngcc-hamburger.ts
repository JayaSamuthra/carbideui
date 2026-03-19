import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { NgccButton } from '../../ngcc-button/ngcc-button';

/**
 * Hamburger / close toggle button for side-nav.
 *
 * Two-way bindable via [(active)]:
 *   <ngcc-hamburger [(active)]="sideNavOpen" />
 */
@Component({
  selector: 'ngcc-hamburger',
  standalone: true,
  imports: [NgccButton],
  templateUrl: './ngcc-hamburger.html',
  styleUrls: ['./ngcc-hamburger.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHamburger {
  /** Two-way bindable open/close state — use [(active)]="myVar" in parent */
  readonly active = model(false);
  readonly label = input('Open navigation menu');
  readonly labelClose = input('Close navigation menu');

  readonly currentLabel = computed(() => (this.active() ? this.labelClose() : this.label()));

  toggle(): void {
    this.active.update((v) => !v);
  }
}
