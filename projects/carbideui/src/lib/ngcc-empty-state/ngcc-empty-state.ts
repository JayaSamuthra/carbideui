import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgccIcon } from '../ngcc-icons/ngcc-icon';
import type { NgccIconNameType } from '../ngcc-icons/icons';

export type NgccEmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * Empty state: icon, title, description and action.
 * - `icon` uses the icon registry; project `[ngccEmptyIcon]` for a custom illustration.
 * - Project buttons/links into `[ngccEmptyAction]` for the call to action.
 */
@Component({
  selector: 'ngcc-empty-state',
  standalone: true,
  imports: [NgccIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styleUrl: './ngcc-empty-state.scss',
  template: `
    <div [class]="'ngcc-empty ngcc-empty--' + size()">
      <div class="ngcc-empty__icon">
        <ng-content select="[ngccEmptyIcon]">
          @if (icon(); as name) {
            <ngcc-icon [name]="name" [size]="size() === 'sm' ? 'lg' : 'xl'" [decorative]="true" />
          }
        </ng-content>
      </div>
      <h3 class="ngcc-empty__title">{{ title() }}</h3>
      @if (description()) {
        <p class="ngcc-empty__description">{{ description() }}</p>
      }
      <div class="ngcc-empty__action"><ng-content select="[ngccEmptyAction]" /></div>
    </div>
  `,
})
export class NgccEmptyState {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly icon = input<NgccIconNameType | undefined>(undefined);
  readonly size = input<NgccEmptyStateSize>('md');
}
