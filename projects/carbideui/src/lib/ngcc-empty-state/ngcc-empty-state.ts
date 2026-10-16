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
  styles: `
    .ngcc-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--ngcc-empty-padding, 3rem 1rem);
      color: var(--cds-text-secondary);
    }
    .ngcc-empty--sm {
      --ngcc-empty-padding: 1.5rem 1rem;
    }
    .ngcc-empty--lg {
      --ngcc-empty-padding: 5rem 1rem;
    }
    .ngcc-empty__icon {
      margin-block-end: 1rem;
      color: var(--cds-icon-secondary);
    }
    .ngcc-empty__title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--cds-text-primary);
    }
    .ngcc-empty--sm .ngcc-empty__title {
      font-size: 1rem;
    }
    .ngcc-empty__description {
      margin: 0.5rem 0 0;
      max-inline-size: 24rem;
      font-size: 0.875rem;
      line-height: 1.43;
    }
    .ngcc-empty__action {
      margin-block-start: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }
    .ngcc-empty__action:empty {
      display: none;
    }
  `,
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
