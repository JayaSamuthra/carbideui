import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';

let nextId = 0;

const CONTROL_SELECTOR =
  'input:not([type=hidden]), select, textarea, button[role=combobox], [role=combobox]';

/**
 * Layout and accessibility wrapper for one form control: label above, optional marker, helper text,
 * error text and an optional tooltip.
 *
 * ```html
 * <ngcc-form-field label="Hostname" [optional]="true" helperText="Letters and digits" [error]="error()">
 *   <input class="cds--text-input" formControlName="host" />
 * </ngcc-form-field>
 * ```
 *
 * The first control inside (input, select, textarea or combobox) is linked automatically: the label's
 * `for`, `aria-describedby` (helper or error, merged with ids you already set), `aria-invalid` and
 * `aria-required`. Use it with native controls, or with controls that do not draw their own label.
 * Required fields get an asterisk; optional ones get "(optional)" (`optionalLabel` translates it), which
 * is the recommended convention: mark the exception, not the rule.
 */
@Component({
  selector: 'ngcc-form-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styleUrl: './ngcc-form-field.scss',
  template: `
    <div class="ngcc-field__label-row">
      <label class="cds--label ngcc-field__label" [id]="labelId" [attr.for]="controlId">
        {{ label() }}
        @if (required()) {
          <span class="cds--input-required" aria-hidden="true">*</span>
        } @else if (optional()) {
          <span class="ngcc-field__optional">({{ optionalLabel() }})</span>
        }
      </label>
      @if (tooltip()) {
        <button
          type="button"
          class="ngcc-field__tip"
          [attr.aria-label]="tooltip()"
          [attr.title]="tooltip()"
        >
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path
              d="M17 22v-8h-4v2h2v6h-3v2h8v-2h-3zM16 8a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 8z"
            ></path>
            <path
              d="M16 30a14 14 0 1 1 14-14 14 14 0 0 1-14 14zm0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4z"
            ></path>
          </svg>
        </button>
      }
    </div>
    <div class="ngcc-field__control"><ng-content /></div>
    @if (error()) {
      <div class="cds--form-requirement ngcc-field__message" [id]="messageId" role="alert">
        {{ error() }}
      </div>
    } @else if (helperText()) {
      <div class="cds--form__helper-text ngcc-field__message" [id]="messageId">
        {{ helperText() }}
      </div>
    }
  `,
})
export class NgccFormField {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly uid = nextId++;

  readonly label = input.required<string>();
  /** Show the required asterisk (and set `aria-required` on the control). */
  readonly required = input(false);
  /** Show "(optional)" next to the label. Ignored when `required`. */
  readonly optional = input(false);
  readonly optionalLabel = input('optional');
  readonly helperText = input('');
  /** Error message. When set it replaces the helper text and marks the control invalid. */
  readonly error = input('');
  /** Short explanation shown from an info button next to the label. */
  readonly tooltip = input('');

  protected readonly labelId = `ngcc-field-${this.uid}-label`;
  protected readonly messageId = `ngcc-field-${this.uid}-message`;
  protected controlId: string | null = null;

  constructor() {
    afterNextRender(() => this.link());
    effect(() => {
      // Re-link whenever what the control points at changes.
      this.error();
      this.helperText();
      this.required();
      this.link();
    });
  }

  private control(): HTMLElement | null {
    return this.host.nativeElement.querySelector<HTMLElement>(CONTROL_SELECTOR);
  }

  private link(): void {
    const control = this.control();
    if (!control) return;
    if (!control.id) control.id = `ngcc-field-${this.uid}-control`;
    if (this.controlId !== control.id) {
      this.controlId = control.id;
      this.host.nativeElement.querySelector('label')?.setAttribute('for', control.id);
    }

    const message = this.error() || this.helperText() ? this.messageId : null;
    const others = (control.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter((id) => id && id !== this.messageId);
    const describedBy = [...others, ...(message ? [message] : [])].join(' ');
    if (describedBy) control.setAttribute('aria-describedby', describedBy);
    else control.removeAttribute('aria-describedby');

    if (this.error()) control.setAttribute('aria-invalid', 'true');
    else if (control.getAttribute('aria-invalid') === 'true')
      control.removeAttribute('aria-invalid');

    if (this.required()) control.setAttribute('aria-required', 'true');
  }
}
