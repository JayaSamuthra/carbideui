import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  contentChildren,
  effect,
  ElementRef,
  inject,
  computed,
  model,
  forwardRef,
  untracked,
} from '@angular/core';
import { NgccContentSwitcherOption } from './ngcc-content-switcher-option';
import { NGCC_CONTENT_SWITCHER, NgccContentSwitcherContext } from './ngcc-content-switcher.token';

@Component({
  selector: 'ngcc-content-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NGCC_CONTENT_SWITCHER,
      useExisting: forwardRef(() => NgccContentSwitcher),
    },
  ],
  template: `
    <div
      [attr.aria-label]="ariaLabel()"
      [class]="switcherClasses()"
      role="tablist"
      (keydown)="onKeydown($event)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class NgccContentSwitcher implements NgccContentSwitcherContext {
  readonly ariaLabel = input('content switcher');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly lowContrast = input(false);
  readonly selectionMode = input<'automatic' | 'manual'>('automatic');

  readonly selectedIndex = model<number | undefined>(undefined);

  readonly selected = output<NgccContentSwitcherOption>();

  readonly options = contentChildren(NgccContentSwitcherOption);

  private readonly hostRef = inject(ElementRef<HTMLElement>);

  readonly switcherClasses = computed(() => {
    const s = this.size();
    return [
      'cds--content-switcher',
      s === 'sm' ? 'cds--content-switcher--sm' : '',
      s === 'md' ? 'cds--content-switcher--md' : '',
      s === 'lg' ? 'cds--content-switcher--lg' : '',
      this.lowContrast() ? 'cds--content-switcher--low-contrast' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  constructor() {
    // Sync selectionMode to children
    effect(() => {
      const mode = this.selectionMode();
      untracked(() => {
        this.options().forEach((option) => option.selectionMode.set(mode));
      });
    });

    // Handle selectedIndex or options changes
    effect(() => {
      const index = this.selectedIndex();
      const opts = this.options();

      if (opts.length === 0) return;

      untracked(() => {
        if (index !== undefined && index >= 0 && index < opts.length) {
          opts.forEach((opt, i) => {
            opt.active.set(i === index);
          });
        } else {
          const hasActive = opts.some((opt) => opt.active());
          if (!hasActive) {
            opts[0].active.set(true);
          }
        }
      });
    });
  }

  selectOption(option: unknown): void {
    const opt = option as NgccContentSwitcherOption;
    const opts = this.options();
    const index = opts.indexOf(opt);

    opts.forEach((o) => {
      if (o !== opt) o.active.set(false);
    });

    opt.active.set(true);

    if (index !== -1) {
      this.selectedIndex.set(index);
    }

    this.selected.emit(opt);
  }

  onKeydown(event: KeyboardEvent): void {
    const buttonList = Array.from(
      this.hostRef.nativeElement.querySelectorAll('ngcc-content-switcher-option'),
    ) as HTMLElement[];
    if (!buttonList.length) return;

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const index = buttonList.findIndex((item) => item === event.target);
        if (index < buttonList.length - 1) {
          buttonList[index + 1].focus();
        } else {
          buttonList[0].focus();
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const index = buttonList.findIndex((item) => item === event.target);
        if (index > 0) {
          buttonList[index - 1].focus();
        } else {
          buttonList[buttonList.length - 1].focus();
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        buttonList[0].focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        buttonList[buttonList.length - 1].focus();
        break;
      }
    }
  }
}
