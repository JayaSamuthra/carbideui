import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgccIcon } from '../ngcc-icons/ngcc-icon';

export type NgccStatTrend = 'up' | 'down' | 'flat';
export type NgccStatStatus = 'none' | 'success' | 'warning' | 'error' | 'info';
/** Whether a rising value is good (revenue) or bad (cost, errors). */
export type NgccStatTrendSentiment = 'positive-up' | 'positive-down' | 'neutral';

/**
 * KPI tile: label, value, optional delta with trend arrow, and a status accent bar.
 * If `trend` is omitted it is derived from the sign of a numeric `delta`.
 */
@Component({
  selector: 'ngcc-stat-tile',
  standalone: true,
  imports: [NgccIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styles: `
    .ngcc-stat {
      border-inline-start: 4px solid var(--ngcc-stat-accent, transparent);
    }
    .ngcc-stat__label {
      margin: 0;
      color: var(--cds-text-secondary);
      font-size: var(--cds-label-01-font-size, 0.75rem);
    }
    .ngcc-stat__value {
      margin: 0.5rem 0 0;
      font-size: 2rem;
      line-height: 1.2;
      font-weight: 300;
      color: var(--cds-text-primary);
    }
    .ngcc-stat__unit {
      font-size: 1rem;
      margin-inline-start: 0.25rem;
      color: var(--cds-text-secondary);
    }
    .ngcc-stat__delta {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--ngcc-stat-delta, var(--cds-text-secondary));
    }
    .ngcc-stat__delta ngcc-icon {
      fill: currentColor;
    }
    .ngcc-stat__caption {
      margin-inline-start: 0.25rem;
      color: var(--cds-text-secondary);
    }
  `,
  template: `
    <div
      class="cds--tile ngcc-stat"
      [style.--ngcc-stat-accent]="accentColor()"
      [style.--ngcc-stat-delta]="deltaColor()"
    >
      <p class="ngcc-stat__label">{{ label() }}</p>
      <p class="ngcc-stat__value">
        {{ value() }}
        @if (unit()) {
          <span class="ngcc-stat__unit">{{ unit() }}</span>
        }
      </p>
      @if (hasDelta()) {
        <p class="ngcc-stat__delta" [attr.aria-label]="deltaAriaLabel()">
          @if (resolvedTrend() !== 'flat') {
            <ngcc-icon
              [name]="resolvedTrend() === 'up' ? 'arrow_up' : 'arrow_down'"
              size="sm"
              [decorative]="true"
            />
          }
          <span>{{ delta() }}</span>
          @if (deltaCaption()) {
            <span class="ngcc-stat__caption">{{ deltaCaption() }}</span>
          }
        </p>
      }
    </div>
  `,
})
export class NgccStatTile {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly unit = input('');
  /** Displayed as-is; numbers get a leading + / − and are used to infer the trend. */
  readonly delta = input<string | number | undefined>(undefined);
  readonly deltaCaption = input('');
  readonly trend = input<NgccStatTrend | undefined>(undefined);
  readonly trendSentiment = input<NgccStatTrendSentiment>('positive-up');
  readonly status = input<NgccStatStatus>('none');

  protected readonly hasDelta = computed(() => this.delta() !== undefined && this.delta() !== '');

  protected readonly resolvedTrend = computed<NgccStatTrend>(() => {
    const explicit = this.trend();
    if (explicit) return explicit;
    const d = this.delta();
    const n = typeof d === 'number' ? d : parseFloat(String(d ?? ''));
    if (Number.isNaN(n) || n === 0) return 'flat';
    return n > 0 ? 'up' : 'down';
  });

  protected readonly accentColor = computed(() => {
    const s = this.status();
    return s === 'none' ? null : `var(--cds-support-${s})`;
  });

  protected readonly deltaColor = computed(() => {
    const t = this.resolvedTrend();
    const sentiment = this.trendSentiment();
    if (t === 'flat' || sentiment === 'neutral') return null;
    const good = (t === 'up') === (sentiment === 'positive-up');
    return good ? 'var(--cds-support-success)' : 'var(--cds-support-error)';
  });

  protected readonly deltaAriaLabel = computed(() => {
    const t = this.resolvedTrend();
    const dir = t === 'up' ? 'Up' : t === 'down' ? 'Down' : 'Unchanged';
    return `${dir} ${this.delta()} ${this.deltaCaption()}`.trim();
  });
}
