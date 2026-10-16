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
  styles: `
    .ngcc-notif__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 1rem;
      border-block-end: 1px solid var(--cds-border-subtle-01);
    }
    .ngcc-notif__heading {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--cds-text-primary);
    }
    .ngcc-notif__count {
      margin-inline-start: 0.5rem;
      padding: 0 0.5rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--cds-text-on-color);
      background: var(--cds-support-error);
    }
    .ngcc-notif__actions {
      display: flex;
      gap: 0.25rem;
    }
    .ngcc-notif__link {
      padding: 0.25rem 0.5rem;
      border: 0;
      background: none;
      font: inherit;
      font-size: 0.75rem;
      color: var(--cds-link-primary);
      cursor: pointer;
    }
    .ngcc-notif__link:hover:not(:disabled) {
      text-decoration: underline;
    }
    .ngcc-notif__link:disabled {
      color: var(--cds-text-disabled);
      cursor: not-allowed;
    }
    .ngcc-notif__link:focus-visible,
    .ngcc-notif__main:focus-visible,
    .ngcc-notif__dismiss:focus-visible {
      outline: 2px solid var(--cds-focus);
      outline-offset: -2px;
    }
    .ngcc-notif__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .ngcc-notif__item {
      display: flex;
      align-items: flex-start;
      border-block-end: 1px solid var(--cds-border-subtle-01);
      border-inline-start: 3px solid var(--ngcc-notif-color, transparent);
    }
    .ngcc-notif__item--info {
      --ngcc-notif-color: var(--cds-support-info);
    }
    .ngcc-notif__item--success {
      --ngcc-notif-color: var(--cds-support-success);
    }
    .ngcc-notif__item--warning {
      --ngcc-notif-color: var(--cds-support-warning);
    }
    .ngcc-notif__item--error {
      --ngcc-notif-color: var(--cds-support-error);
    }
    .ngcc-notif__item--read {
      --ngcc-notif-color: transparent;
    }
    .ngcc-notif__main {
      flex: 1;
      min-inline-size: 0;
      padding: 0.75rem 0.5rem 0.75rem 1rem;
      border: 0;
      background: none;
      text-align: start;
      font: inherit;
      color: var(--cds-text-primary);
      cursor: pointer;
    }
    .ngcc-notif__main:hover {
      background: var(--cds-layer-hover-01);
    }
    .ngcc-notif__title {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .ngcc-notif__item--read .ngcc-notif__title {
      font-weight: 400;
    }
    .ngcc-notif__message {
      display: block;
      margin-block-start: 0.25rem;
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
    }
    .ngcc-notif__time {
      display: block;
      margin-block-start: 0.25rem;
      font-size: 0.75rem;
      color: var(--cds-text-helper);
    }
    .ngcc-notif__dismiss {
      flex: none;
      margin: 0.5rem 0.5rem 0 0;
      padding: 0.25rem;
      border: 0;
      background: none;
      color: var(--cds-icon-secondary);
      cursor: pointer;
      line-height: 0;
    }
    .ngcc-notif__empty {
      margin: 0;
      padding: 2rem 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
    }
  `,
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
