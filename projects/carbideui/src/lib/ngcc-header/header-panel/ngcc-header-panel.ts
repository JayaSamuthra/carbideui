import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Sliding panel linked to a header action (notifications, app-switcher, etc.).
 * Typically placed immediately after <ngcc-header> in the page layout.
 *
 * <ngcc-header-panel [expanded]="notifOpen" ariaLabel="Notifications">
 *   <!-- panel content -->
 * </ngcc-header-panel>
 */
@Component({
  selector: 'ngcc-header-panel',
  standalone: true,
  imports: [],
  templateUrl: './ngcc-header-panel.html',
  styleUrls: ['./ngcc-header-panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgccHeaderPanel {
  readonly expanded = input(false);
  readonly ariaLabel = input('Panel');

  readonly panelClasses = computed(() =>
    ['cds--header-panel', this.expanded() ? 'cds--header-panel--expanded' : '']
      .filter(Boolean)
      .join(' '),
  );
}
