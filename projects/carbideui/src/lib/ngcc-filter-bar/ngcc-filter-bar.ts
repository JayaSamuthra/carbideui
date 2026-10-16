import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { NgccTag } from '../ngcc-tag/ngcc-tag';

export interface NgccFilterOption {
  label: string;
  value: string;
}

export interface NgccFilterField {
  key: string;
  label: string;
  options: NgccFilterOption[];
}

export interface NgccFilterBarValue {
  /** Free-text search. */
  query: string;
  /** Selected option values per field key. */
  filters: Record<string, string[]>;
}

interface NgccFilterSuggestion {
  field: NgccFilterField;
  option: NgccFilterOption;
}

/**
 * Filter bar: a search input that is also a combobox. Typing narrows a list of
 * `Field: Option` suggestions; picking one adds a dismissible chip. The free-text
 * `query` and the chips are both part of the two-way `value`.
 */
@Component({
  selector: 'ngcc-filter-bar',
  standalone: true,
  imports: [NgccTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block; position: relative' },
  styleUrl: './ngcc-filter-bar.scss',
  template: `
    <div class="ngcc-fb">
      <div class="ngcc-fb__box">
        @for (chip of chips(); track chip.field.key + chip.option.value) {
          <ngcc-tag
            type="gray"
            [dismissible]="true"
            [dismissLabel]="'Remove filter ' + chip.field.label + ': ' + chip.option.label"
            (dismissed)="remove(chip)"
            >{{ chip.field.label }}: {{ chip.option.label }}</ngcc-tag
          >
        }
        <input
          type="text"
          class="ngcc-fb__input"
          role="combobox"
          aria-autocomplete="list"
          autocomplete="off"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-expanded]="showList()"
          [attr.aria-controls]="listId"
          [attr.aria-activedescendant]="activeId()"
          [placeholder]="placeholder()"
          [value]="value().query"
          (input)="onInput($any($event.target).value)"
          (focus)="open.set(true)"
          (blur)="open.set(false)"
          (keydown)="onKeydown($event)"
        />
      </div>
      @if (hasAny()) {
        <button type="button" class="ngcc-fb__clear" (click)="clearAll()">Clear all</button>
      }
    </div>
    <ul
      class="ngcc-fb__list"
      role="listbox"
      [id]="listId"
      [attr.aria-label]="'Filter suggestions'"
      [hidden]="!showList()"
    >
      @for (s of suggestions(); track s.field.key + s.option.value; let i = $index) {
        <li
          role="option"
          [id]="optionId(i)"
          [class]="'ngcc-fb__option' + (i === active() ? ' ngcc-fb__option--active' : '')"
          [attr.aria-selected]="i === active()"
          (mousedown)="$event.preventDefault(); add(s)"
        >
          <span class="ngcc-fb__field">{{ s.field.label }}:</span> {{ s.option.label }}
        </li>
      }
    </ul>
  `,
})
export class NgccFilterBar {
  private static nextId = 0;
  protected readonly listId = `ngcc-fb-list-${NgccFilterBar.nextId++}`;

  readonly value = model<NgccFilterBarValue>({ query: '', filters: {} });
  readonly fields = input<NgccFilterField[]>([]);
  readonly placeholder = input('Search or filter');
  readonly ariaLabel = input('Search and filter');
  readonly maxSuggestions = input(8);

  protected readonly open = signal(false);
  protected readonly active = signal(-1);

  protected readonly chips = computed<NgccFilterSuggestion[]>(() =>
    this.fields().flatMap((field) =>
      (this.value().filters[field.key] ?? [])
        .map((v) => field.options.find((o) => o.value === v))
        .filter((o): o is NgccFilterOption => !!o)
        .map((option) => ({ field, option })),
    ),
  );

  protected readonly suggestions = computed<NgccFilterSuggestion[]>(() => {
    const q = this.value().query.trim().toLowerCase();
    const selected = this.value().filters;
    return this.fields()
      .flatMap((field) =>
        field.options
          .filter((o) => !selected[field.key]?.includes(o.value))
          .map((option) => ({ field, option })),
      )
      .filter((s) => !q || `${s.field.label} ${s.option.label}`.toLowerCase().includes(q))
      .slice(0, this.maxSuggestions());
  });

  protected readonly showList = computed(() => this.open() && this.suggestions().length > 0);
  protected readonly hasAny = computed(() => !!this.value().query || this.chips().length > 0);
  protected readonly activeId = computed(() =>
    this.showList() && this.active() >= 0 ? this.optionId(this.active()) : null,
  );

  protected optionId(i: number): string {
    return `${this.listId}-opt-${i}`;
  }

  protected onInput(query: string): void {
    this.value.update((v) => ({ ...v, query }));
    this.open.set(true);
    this.active.set(-1);
  }

  protected add(s: NgccFilterSuggestion): void {
    this.value.update((v) => ({
      query: '',
      filters: { ...v.filters, [s.field.key]: [...(v.filters[s.field.key] ?? []), s.option.value] },
    }));
    this.active.set(-1);
  }

  protected remove(s: NgccFilterSuggestion): void {
    this.value.update((v) => {
      const left = (v.filters[s.field.key] ?? []).filter((x) => x !== s.option.value);
      const filters = { ...v.filters };
      if (left.length) filters[s.field.key] = left;
      else delete filters[s.field.key];
      return { ...v, filters };
    });
  }

  protected clearAll(): void {
    this.value.set({ query: '', filters: {} });
    this.active.set(-1);
  }

  protected onKeydown(ev: KeyboardEvent): void {
    const n = this.suggestions().length;
    switch (ev.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        if (!n) return;
        ev.preventDefault();
        this.open.set(true);
        const step = ev.key === 'ArrowDown' ? 1 : -1;
        this.active.update((i) => (i < 0 ? (step > 0 ? 0 : n - 1) : (i + step + n) % n));
        break;
      }
      case 'Enter': {
        const s = this.showList() ? this.suggestions()[this.active()] : undefined;
        if (s) {
          ev.preventDefault();
          this.add(s);
        }
        break;
      }
      case 'Escape':
        if (this.open()) {
          this.open.set(false);
          ev.preventDefault();
        } else if (this.value().query) {
          this.onInput('');
          this.open.set(false);
        }
        break;
      case 'Backspace': {
        const chips = this.chips();
        if (!this.value().query && chips.length) this.remove(chips[chips.length - 1]);
        break;
      }
    }
  }
}
