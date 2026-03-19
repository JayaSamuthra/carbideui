import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { NgccButton } from '../../ngcc-button/ngcc-button';
import type { NgccIconNameType } from '../../ngcc-icons/icons';

/**
 * Global header action button (search, notifications, app-switcher, etc.).
 * Placed inside <ngcc-header-global>.
 *
 * Renders via NgccButton (ghost, icon-only). Use [(active)] for two-way panel toggling:
 *   <ngcc-header-action ariaLabel="Search" iconName="search" [(active)]="searchOpen" />
 */
@Component({
  selector: 'ngcc-header-action',
  standalone: true,
  imports: [NgccButton],
  templateUrl: './ngcc-header-action.html',
  styleUrls: ['./ngcc-header-action.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderAction {
  private elementRef = inject(ElementRef);

  /** Accessible label for the button */
  readonly ariaLabel = input('');
  /** Two-way bindable active/panel-open state — use [(active)]="myVar" in parent */
  readonly active = model(false);
  /** Icon to display — any key from the NgccIcon registry */
  readonly iconName = input<NgccIconNameType | undefined>(undefined);
  /** Set false to make the button fire-and-forget (no toggle behaviour) */
  readonly toggleable = input(true);

  readonly actionClick = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.actionClick.emit(event);
    if (this.toggleable()) {
      this.active.update((v) => !v);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.active() || !this.toggleable()) return;

    // Evaluate click path to support detached DOM elements
    const path = event.composedPath() as HTMLElement[];
    const isInsideAction = path.includes(this.elementRef.nativeElement);

    // If click is inside any panel, we do not close the action so the panel remains usable
    const isInsidePanel = path.some((el) => el.tagName?.toLowerCase() === 'ngcc-header-panel');

    if (!isInsideAction && !isInsidePanel) {
      this.active.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.active() && this.toggleable()) {
      this.active.set(false);
      // Return focus to the trigger element when closed via Escape key
      this.elementRef.nativeElement.querySelector('button')?.focus();
    }
  }
}
