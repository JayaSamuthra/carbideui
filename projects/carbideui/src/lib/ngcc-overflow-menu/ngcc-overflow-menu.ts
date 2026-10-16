import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';

export interface NgccOverflowMenuItem {
  id: string | number;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  /** Draws a separator line above this item. */
  divider?: boolean;
}

export type NgccOverflowMenuSize = 'sm' | 'md' | 'lg';

/**
 * Overflow (row action) menu. The menu is `position: fixed`, so it is not clipped by
 * table or scroll containers. Keyboard: Enter/Space/ArrowDown open, arrows/Home/End move,
 * Escape closes and returns focus to the trigger.
 */
@Component({
  selector: 'ngcc-overflow-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: inline-block',
    '(document:click)': 'onDocumentClick($event)',
    '(window:resize)': 'close()',
    '(window:blur)': 'close()',
  },
  styleUrl: './ngcc-overflow-menu.scss',
  template: `
    <button
      #trigger
      type="button"
      [class]="
        'cds--overflow-menu' +
        (size() !== 'md' ? ' cds--overflow-menu--' + size() : '') +
        (open() ? ' cds--overflow-menu--open' : '')
      "
      aria-haspopup="menu"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="ariaLabel()"
      [disabled]="disabled()"
      (click)="toggle()"
      (keydown)="onTriggerKeydown($event)"
    >
      <svg
        class="cds--overflow-menu__icon"
        width="16"
        height="16"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        @if (orientation() === 'vertical') {
          <circle cx="16" cy="8" r="2"></circle>
          <circle cx="16" cy="16" r="2"></circle>
          <circle cx="16" cy="24" r="2"></circle>
        } @else {
          <circle cx="8" cy="16" r="2"></circle>
          <circle cx="16" cy="16" r="2"></circle>
          <circle cx="24" cy="16" r="2"></circle>
        }
      </svg>
    </button>
    @if (open()) {
      <ul
        class="cds--overflow-menu-options cds--overflow-menu-options--open ngcc-overflow__menu"
        role="menu"
        [attr.aria-label]="ariaLabel()"
        [style.--ngcc-overflow-top.px]="pos().top"
        [style.--ngcc-overflow-bottom.px]="pos().bottom"
        [style.--ngcc-overflow-left.px]="pos().left"
        [style.--ngcc-overflow-right.px]="pos().right"
        (keydown)="onMenuKeydown($event)"
      >
        @for (item of items(); track item.id) {
          <li
            role="none"
            [class]="
              'cds--overflow-menu-options__option' +
              (item.danger ? ' cds--overflow-menu-options__option--danger' : '') +
              (item.disabled ? ' cds--overflow-menu-options__option--disabled' : '') +
              (item.divider ? ' ngcc-overflow__divider' : '')
            "
          >
            <button
              #option
              type="button"
              role="menuitem"
              class="cds--overflow-menu-options__btn"
              tabindex="-1"
              [disabled]="item.disabled"
              (click)="select(item)"
            >
              <span class="cds--overflow-menu-options__option-content">{{ item.label }}</span>
            </button>
          </li>
        }
      </ul>
    }
  `,
})
export class NgccOverflowMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly options = viewChildren<ElementRef<HTMLButtonElement>>('option');

  readonly items = input<NgccOverflowMenuItem[]>([]);
  readonly ariaLabel = input('Actions');
  /** Which edge of the trigger the menu lines up with. */
  readonly align = input<'start' | 'end'>('end');
  readonly size = input<NgccOverflowMenuSize>('md');
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly disabled = input(false);

  readonly itemSelected = output<NgccOverflowMenuItem>();

  protected readonly open = signal(false);
  protected readonly pos = signal<{
    top: number | null;
    bottom: number | null;
    left: number | null;
    right: number | null;
  }>({ top: null, bottom: null, left: null, right: null });

  constructor() {
    // Fixed positioning would detach the menu from its trigger on scroll, so close instead.
    effect((onCleanup) => {
      if (!this.open()) return;
      const close = (): void => this.close();
      document.addEventListener('scroll', close, true);
      onCleanup(() => document.removeEventListener('scroll', close, true));
    });
  }

  protected toggle(): void {
    if (this.open()) this.close();
    else this.show(0);
  }

  protected close(returnFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (returnFocus) this.trigger()?.focus();
  }

  private trigger(): HTMLButtonElement | null {
    return this.host.nativeElement.querySelector('button.cds--overflow-menu');
  }

  private show(focusFrom: number | 'last'): void {
    const trigger = this.trigger();
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const estimate = this.items().length * 40;
    const flip = rect.bottom + estimate > window.innerHeight && rect.top > estimate;
    const end = this.align() === 'end';
    this.pos.set({
      top: flip ? null : rect.bottom,
      bottom: flip ? window.innerHeight - rect.top : null,
      left: end ? null : rect.left,
      right: end ? document.documentElement.clientWidth - rect.right : null,
    });
    this.open.set(true);
    afterNextRender(
      () =>
        this.focusOption(focusFrom === 'last' ? this.enabledIndexes().length - 1 : focusFrom, true),
      {
        injector: this.injector,
      },
    );
  }

  private enabledIndexes(): number[] {
    return this.options()
      .map((o, i) => (o.nativeElement.disabled ? -1 : i))
      .filter((i) => i >= 0);
  }

  /** `n` indexes into the enabled options; wraps around when `wrap`. */
  private focusOption(n: number, wrap = false): void {
    const enabled = this.enabledIndexes();
    if (!enabled.length) return;
    const i = wrap
      ? (n + enabled.length) % enabled.length
      : Math.min(Math.max(n, 0), enabled.length - 1);
    this.options()[enabled[i]].nativeElement.focus();
  }

  protected select(item: NgccOverflowMenuItem): void {
    if (item.disabled) return;
    this.close(true);
    this.itemSelected.emit(item);
  }

  protected onTriggerKeydown(ev: KeyboardEvent): void {
    if (this.open()) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.show(0);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.show('last');
    }
  }

  protected onMenuKeydown(ev: KeyboardEvent): void {
    const enabled = this.enabledIndexes();
    const current = enabled.indexOf(
      this.options().findIndex((o) => o.nativeElement === document.activeElement),
    );
    switch (ev.key) {
      case 'ArrowDown':
        this.focusOption(current + 1, true);
        break;
      case 'ArrowUp':
        this.focusOption(current - 1, true);
        break;
      case 'Home':
        this.focusOption(0);
        break;
      case 'End':
        this.focusOption(enabled.length - 1);
        break;
      case 'Escape':
        this.close(true);
        break;
      case 'Tab':
        this.close();
        return;
      default:
        return;
    }
    ev.preventDefault();
  }

  protected onDocumentClick(ev: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(ev.target as Node)) this.close();
  }
}
