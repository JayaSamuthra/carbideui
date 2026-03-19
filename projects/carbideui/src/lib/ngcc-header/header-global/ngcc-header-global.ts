import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Container for global header action buttons (right-hand side).
 * Project <ngcc-header-action> elements as children.
 *
 * <ngcc-header-global>
 *   <ngcc-header-action ariaLabel="Search">…</ngcc-header-action>
 *   <ngcc-header-action ariaLabel="Notifications">…</ngcc-header-action>
 * </ngcc-header-global>
 */
@Component({
  selector: 'ngcc-header-global',
  standalone: true,
  imports: [],
  templateUrl: './ngcc-header-global.html',
  styleUrls: ['./ngcc-header-global.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderGlobal {}
