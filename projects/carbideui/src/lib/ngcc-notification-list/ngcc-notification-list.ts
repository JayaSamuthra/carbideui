import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type NgccNotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface NgccNotificationItem {
  id: string | number;
  title: string;
  message?: string;
  /** Pre-formatted display text, e.g. "5 min ago". */
  timestamp?: string;
  read?: boolean;
  severity?: NgccNotificationSeverity;
}

/**
 * Notification list sized for `ngcc-header-panel` (fills its width).
 * Stateless: the parent owns `items` and updates them in response to
 * `markRead`, `markAllRead`, `clear` and `dismissed`.
 */
@Component({
  selector: 'ngcc-notification-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styleUrl: './ngcc-notification-list.scss',
  template: `
    <div class="ngcc-notif__header">
      <h2 class="ngcc-notif__heading">
        {{ heading() }}
        @if (unreadCount() > 0) {
          <span class="ngcc-notif__count" [attr.aria-label]="unreadCount() + ' unread'">{{
            unreadCount()
          }}</span>
        }
      </h2>
      <div class="ngcc-notif__actions">
        <button
          type="button"
          class="ngcc-notif__link"
          [disabled]="unreadCount() === 0"
          (click)="markAllRead.emit()"
        >
          Mark all read
        </button>
        <button
          type="button"
          class="ngcc-notif__link"
          [disabled]="items().length === 0"
          (click)="clear.emit()"
        >
          Clear all
        </button>
      </div>
    </div>
    @if (items().length) {
      <ul class="ngcc-notif__list">
        @for (item of items(); track item.id) {
          <li
            [class]="
              'ngcc-notif__item ngcc-notif__item--' +
              (item.severity ?? 'info') +
              (item.read ? ' ngcc-notif__item--read' : '')
            "
          >
            <button type="button" class="ngcc-notif__main" (click)="itemClicked.emit(item)">
              @if (!item.read) {
                <span class="cds--visually-hidden">Unread: </span>
              }
              <span class="ngcc-notif__title">{{ item.title }}</span>
              @if (item.message) {
                <span class="ngcc-notif__message">{{ item.message }}</span>
              }
              @if (item.timestamp) {
                <span class="ngcc-notif__time">{{ item.timestamp }}</span>
              }
            </button>
            <button
              type="button"
              class="ngcc-notif__dismiss"
              [attr.aria-label]="'Dismiss ' + item.title"
              (click)="dismissed.emit(item)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16z"
                ></path>
              </svg>
            </button>
          </li>
        }
      </ul>
    } @else {
      <p class="ngcc-notif__empty">{{ emptyText() }}</p>
    }
  `,
})
export class NgccNotificationList {
  readonly items = input<NgccNotificationItem[]>([]);
  readonly heading = input('Notifications');
  readonly emptyText = input("You're all caught up");

  readonly itemClicked = output<NgccNotificationItem>();
  readonly dismissed = output<NgccNotificationItem>();
  readonly markAllRead = output<void>();
  readonly clear = output<void>();

  protected readonly unreadCount = computed(() => this.items().filter((i) => !i.read).length);
}
