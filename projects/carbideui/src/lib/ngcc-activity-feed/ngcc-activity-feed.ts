import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgccActivityStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type NgccActivityFeedVariant = 'feed' | 'timeline';

export interface NgccActivityItem {
  id: string | number;
  title: string;
  description?: string;
  /** Pre-formatted display text, e.g. "2 hours ago". */
  timestamp?: string;
  /** ISO string for the `<time datetime>` attribute. */
  datetime?: string;
  /** Who/what performed the action. */
  actor?: string;
  status?: NgccActivityStatus;
}

/**
 * Activity feed / timeline. `feed` is a compact list with status dots;
 * `timeline` adds a connecting vertical line between entries.
 */
@Component({
  selector: 'ngcc-activity-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styles: `
    .ngcc-feed {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .ngcc-feed__item {
      position: relative;
      display: flex;
      gap: 1rem;
      padding-block: 0.75rem;
    }
    .ngcc-feed--feed .ngcc-feed__item:not(:last-child) {
      border-block-end: 1px solid var(--cds-border-subtle-01);
    }
    .ngcc-feed__marker {
      position: relative;
      flex: none;
      inline-size: 0.75rem;
      padding-block-start: 0.3rem;
    }
    .ngcc-feed__dot {
      display: block;
      inline-size: 0.75rem;
      block-size: 0.75rem;
      border-radius: 50%;
      background: var(--ngcc-feed-color, var(--cds-support-info));
    }
    .ngcc-feed--timeline .ngcc-feed__item:not(:last-child) .ngcc-feed__marker::after {
      content: '';
      position: absolute;
      inset-block: 1.35rem calc(-0.75rem - 0.3rem);
      inset-inline-start: calc(50% - 1px);
      inline-size: 2px;
      background: var(--cds-border-subtle-01);
    }
    .ngcc-feed__item--success {
      --ngcc-feed-color: var(--cds-support-success);
    }
    .ngcc-feed__item--warning {
      --ngcc-feed-color: var(--cds-support-warning);
    }
    .ngcc-feed__item--error {
      --ngcc-feed-color: var(--cds-support-error);
    }
    .ngcc-feed__item--neutral {
      --ngcc-feed-color: var(--cds-icon-secondary);
    }
    .ngcc-feed__body {
      flex: 1;
      min-inline-size: 0;
    }
    .ngcc-feed__title {
      margin: 0;
      font-size: 0.875rem;
      color: var(--cds-text-primary);
    }
    .ngcc-feed__actor {
      font-weight: 600;
    }
    .ngcc-feed__description {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
    }
    .ngcc-feed__time {
      display: block;
      margin-block-start: 0.25rem;
      font-size: 0.75rem;
      color: var(--cds-text-helper);
    }
    .ngcc-feed__empty {
      margin: 0;
      padding: 1rem 0;
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
    }
  `,
  template: `
    @if (items().length) {
      <ol [class]="'ngcc-feed ngcc-feed--' + variant()" [attr.aria-label]="ariaLabel()">
        @for (item of items(); track item.id) {
          <li [class]="'ngcc-feed__item ngcc-feed__item--' + (item.status ?? 'info')">
            <span class="ngcc-feed__marker" aria-hidden="true"
              ><span class="ngcc-feed__dot"></span
            ></span>
            <div class="ngcc-feed__body">
              <p class="ngcc-feed__title">
                @if (item.actor) {
                  <span class="ngcc-feed__actor">{{ item.actor }}</span>
                }
                {{ item.title }}
              </p>
              @if (item.description) {
                <p class="ngcc-feed__description">{{ item.description }}</p>
              }
              @if (item.timestamp) {
                <time class="ngcc-feed__time" [attr.datetime]="item.datetime ?? null">{{
                  item.timestamp
                }}</time>
              }
            </div>
          </li>
        }
      </ol>
    } @else {
      <p class="ngcc-feed__empty">{{ emptyText() }}</p>
    }
  `,
})
export class NgccActivityFeed {
  readonly items = input<NgccActivityItem[]>([]);
  readonly variant = input<NgccActivityFeedVariant>('feed');
  readonly ariaLabel = input('Activity');
  readonly emptyText = input('No recent activity');
}
