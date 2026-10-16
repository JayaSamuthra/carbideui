import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  model,
} from '@angular/core';

export interface NgccDateRange {
  start: Date | null;
  end: Date | null;
  /** Key of the selected preset, `'custom'` for a hand-picked range, `''` when nothing is chosen. */
  preset: string;
}

export interface NgccDatePreset {
  key: string;
  label: string;
  /** Omit for the custom preset (shows the start/end inputs). */
  range?: (today: Date) => { start: Date; end: Date };
}

const day = (d: Date, offset = 0): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset);

export const NGCC_DEFAULT_DATE_PRESETS: NgccDatePreset[] = [
  { key: 'today', label: 'Today', range: (t) => ({ start: day(t), end: day(t) }) },
  { key: 'last-7-days', label: 'Last 7 days', range: (t) => ({ start: day(t, -6), end: day(t) }) },
  {
    key: 'last-30-days',
    label: 'Last 30 days',
    range: (t) => ({ start: day(t, -29), end: day(t) }),
  },
  {
    key: 'this-month',
    label: 'This month',
    range: (t) => ({
      start: new Date(t.getFullYear(), t.getMonth(), 1),
      end: new Date(t.getFullYear(), t.getMonth() + 1, 0),
    }),
  },
  {
    key: 'last-month',
    label: 'Last month',
    range: (t) => ({
      start: new Date(t.getFullYear(), t.getMonth() - 1, 1),
      end: new Date(t.getFullYear(), t.getMonth(), 0),
    }),
  },
  { key: 'custom', label: 'Custom range' },
];

/** Resolves a preset key to a concrete range, e.g. to seed `[(value)]`. */
export function ngccResolveDatePreset(
  key: string,
  today: Date = new Date(),
  presets: NgccDatePreset[] = NGCC_DEFAULT_DATE_PRESETS,
): NgccDateRange {
  const range = presets.find((p) => p.key === key)?.range?.(today);
  return { start: range?.start ?? null, end: range?.end ?? null, preset: key };
}

const toIso = (d: Date | null): string =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    : '';

const fromIso = (s: string): Date | null => {
  const [y, m, d] = s.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};

/**
 * Date-range picker with presets. Choosing "Custom range" reveals start/end date
 * inputs; the model only updates once both dates are set and start <= end.
 */
@Component({
  selector: 'ngcc-date-range-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styleUrl: './ngcc-date-range-picker.scss',
  template: `
    <fieldset class="ngcc-drp" [disabled]="disabled()">
      @if (label()) {
        <legend class="cds--label">{{ label() }}</legend>
      }
      <div class="cds--select">
        <div class="cds--select-input__wrapper">
          <select
            class="cds--select-input"
            [attr.aria-label]="label() || 'Date range'"
            (change)="onPreset($any($event.target).value)"
          >
            @if (!value().preset) {
              <option value="" selected disabled hidden>{{ placeholder() }}</option>
            }
            @for (p of presets(); track p.key) {
              <option [value]="p.key" [selected]="p.key === value().preset">{{ p.label }}</option>
            }
          </select>
          <svg
            class="cds--select__arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 11 3 6l.7-.7L8 9.6l4.3-4.3.7.7z"></path>
          </svg>
        </div>
      </div>
      @if (isCustom()) {
        <div class="ngcc-drp__custom">
          <div class="cds--form-item ngcc-drp__field">
            <label class="cds--label" [attr.for]="id + '-start'">Start date</label>
            <input
              type="date"
              class="cds--text-input"
              [id]="id + '-start'"
              [value]="startText()"
              [attr.min]="min()"
              [attr.max]="max()"
              [attr.aria-invalid]="invalid() || null"
              (change)="onCustom('start', $any($event.target).value)"
            />
          </div>
          <div class="cds--form-item ngcc-drp__field">
            <label class="cds--label" [attr.for]="id + '-end'">End date</label>
            <input
              type="date"
              class="cds--text-input"
              [id]="id + '-end'"
              [value]="endText()"
              [attr.min]="startText() || min()"
              [attr.max]="max()"
              [attr.aria-invalid]="invalid() || null"
              (change)="onCustom('end', $any($event.target).value)"
            />
          </div>
        </div>
        @if (invalid()) {
          <div class="cds--form-requirement" role="alert" style="display: block; max-height: none">
            End date must be on or after the start date.
          </div>
        }
      }
    </fieldset>
  `,
})
export class NgccDateRangePicker {
  private static nextId = 0;
  protected readonly id = `ngcc-drp-${NgccDateRangePicker.nextId++}`;

  readonly value = model<NgccDateRange>({ start: null, end: null, preset: '' });
  readonly presets = input<NgccDatePreset[]>(NGCC_DEFAULT_DATE_PRESETS);
  readonly label = input('Date range');
  readonly placeholder = input('Select a range');
  readonly disabled = input(false);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  /** "Today" used to resolve presets; override for tests/SSR. */
  readonly today = input<Date | undefined>(undefined);

  protected readonly min = computed(() => toIso(this.minDate()) || null);
  protected readonly max = computed(() => toIso(this.maxDate()) || null);
  protected readonly isCustom = computed(() => {
    const preset = this.presets().find((p) => p.key === this.value().preset);
    return !!preset && !preset.range;
  });

  protected readonly startText = linkedSignal(() => toIso(this.value().start));
  protected readonly endText = linkedSignal(() => toIso(this.value().end));
  protected readonly invalid = computed(
    () => !!this.startText() && !!this.endText() && this.endText() < this.startText(),
  );

  protected onPreset(key: string): void {
    const preset = this.presets().find((p) => p.key === key);
    if (!preset) return;
    if (preset.range) {
      this.value.set({ ...preset.range(this.today() ?? new Date()), preset: key });
    } else {
      this.value.update((v) => ({ ...v, preset: key }));
    }
  }

  protected onCustom(which: 'start' | 'end', text: string): void {
    (which === 'start' ? this.startText : this.endText).set(text);
    const start = fromIso(this.startText());
    const end = fromIso(this.endText());
    if (start && end && !this.invalid()) {
      this.value.set({ start, end, preset: this.value().preset });
    }
  }
}
