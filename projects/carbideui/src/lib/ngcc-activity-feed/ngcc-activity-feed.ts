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
  styleUrl: './ngcc-activity-feed.scss',
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
