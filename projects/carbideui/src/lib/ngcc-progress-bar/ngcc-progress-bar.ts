import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NgccProgressBarLevel = 'normal' | 'warning' | 'critical' | 'finished';

let nextId = 0;

/**
 * Progress / meter bar. The bar changes color once the value crosses
 * `warningThreshold` and `criticalThreshold` (percent of `max`), which suits
 * usage meters (CPU, disk, quota). Set `finishAtMax` for task progress, where
 * 100% means "done" rather than "critical".
 */
@Component({
  selector: 'ngcc-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  template: `
    <div [class]="classes()">
      <div class="cds--progress-bar__label" [id]="labelId">
        <span>{{ label() }}</span>
        @if (showValue()) {
          <span>{{ percent() }}%</span>
        }
      </div>
      <div
        class="cds--progress-bar__track"
        role="progressbar"
        [attr.aria-labelledby]="labelId"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="clampedValue()"
        [attr.aria-valuetext]="valueText()"
      >
        <div
          class="cds--progress-bar__bar"
          [style.transform]="'scaleX(' + percent() / 100 + ')'"
          [style.background-color]="barColor()"
        ></div>
      </div>
      @if (helperText()) {
        <div class="cds--progress-bar__helper-text">{{ helperText() }}</div>
      }
    </div>
  `,
})
export class NgccProgressBar {
  readonly value = input.required<number>();
  readonly max = input(100);
  readonly label = input('');
  readonly helperText = input('');
  readonly size = input<'big' | 'small'>('big');
  readonly showValue = input(true);
  /** Percent at which the bar turns to the warning color. */
  readonly warningThreshold = input(75);
  /** Percent at which the bar turns to the critical (error) color. */
  readonly criticalThreshold = input(90);
  /** Treat 100% as finished (success) instead of critical; thresholds are ignored. */
  readonly finishAtMax = input(false);

  protected readonly labelId = `ngcc-progress-bar-${nextId++}`;

  protected readonly clampedValue = computed(() => Math.min(Math.max(this.value(), 0), this.max()));

  readonly percent = computed(() => {
    const max = this.max();
    return max > 0 ? Math.round((this.clampedValue() / max) * 100) : 0;
  });

  readonly level = computed<NgccProgressBarLevel>(() => {
    const p = this.percent();
    if (this.finishAtMax()) return p >= 100 ? 'finished' : 'normal';
    if (p >= this.criticalThreshold()) return 'critical';
    if (p >= this.warningThreshold()) return 'warning';
    return 'normal';
  });

  protected readonly valueText = computed(
    () =>
      `${this.percent()}%${this.level() === 'normal' || this.level() === 'finished' ? '' : ` (${this.level()})`}`,
  );

  protected readonly barColor = computed(() => {
    switch (this.level()) {
      case 'warning':
        return 'var(--cds-support-warning)';
      case 'critical':
        return 'var(--cds-support-error)';
      default:
        return null;
    }
  });

  protected readonly classes = computed(() =>
    [
      'cds--progress-bar',
      this.size() === 'big' ? 'cds--progress-bar--big' : 'cds--progress-bar--small',
      this.level() === 'critical' ? 'cds--progress-bar--error' : '',
      this.level() === 'finished' ? 'cds--progress-bar--finished' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
