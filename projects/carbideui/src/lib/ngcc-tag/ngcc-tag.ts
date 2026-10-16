import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type NgccTagType =
  | 'red'
  | 'magenta'
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'gray'
  | 'cool-gray'
  | 'warm-gray'
  | 'high-contrast'
  | 'outline';
export type NgccTagSize = 'sm' | 'md' | 'lg';

/** Convenience map for status badges: `<ngcc-tag [type]="NGCC_STATUS_TAG.running">`. */
export const NGCC_STATUS_TAG = {
  running: 'green',
  success: 'green',
  pending: 'blue',
  warning: 'purple',
  error: 'red',
  stopped: 'gray',
  unknown: 'cool-gray',
} as const satisfies Record<string, NgccTagType>;

/**
 * Tag / status badge. `dot` adds a leading status dot (status-badge look).
 * `dismissible` shows a close button and emits `dismissed`.
 */
@Component({
  selector: 'ngcc-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-flex' },
  styles: `
    .ngcc-tag__dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: currentColor;
      margin-inline-end: 0.375rem;
      flex: none;
    }
  `,
  template: `
    <span [class]="classes()" [attr.aria-disabled]="disabled() || null">
      @if (dot()) {
        <span class="ngcc-tag__dot" aria-hidden="true"></span>
      }
      <span class="cds--tag__label"><ng-content /></span>
      @if (dismissible()) {
        <button
          type="button"
          class="cds--tag__close-icon"
          [disabled]="disabled()"
          [attr.aria-label]="dismissLabel()"
          (click)="dismissed.emit()"
        >
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path
              d="M24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16z"
            ></path>
          </svg>
        </button>
      }
    </span>
  `,
})
export class NgccTag {
  readonly type = input<NgccTagType>('gray');
  readonly size = input<NgccTagSize>('md');
  readonly dot = input(false);
  readonly dismissible = input(false);
  readonly disabled = input(false);
  readonly dismissLabel = input('Clear filter');

  readonly dismissed = output<void>();

  protected readonly classes = computed(() =>
    [
      'cds--tag',
      `cds--tag--${this.type()}`,
      this.size() !== 'md' ? `cds--tag--${this.size()}` : '',
      this.dismissible() ? 'cds--tag--filter' : '',
      this.disabled() ? 'cds--tag--disabled' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
