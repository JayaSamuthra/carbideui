import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { NgccStep, NgccStepState } from './ngcc-stepper.types';

interface NgccStepView {
  step: NgccStep;
  index: number;
  state: NgccStepState;
  reachable: boolean;
  stateLabel: string;
}

const STATE_LABEL: Record<NgccStepState, string> = {
  complete: 'Complete',
  current: 'Current',
  incomplete: 'Incomplete',
  invalid: 'Invalid',
};

/**
 * Stepper / progress indicator for multi-step create flows.
 *
 * `current` is the zero-based index of the active step (two-way bindable). Steps before it are
 * complete, steps after it incomplete; a step marked `invalid` shows the error state. By default
 * (`linear`) only completed steps and the current one can be clicked; set `linear` to `false` to
 * allow jumping anywhere.
 *
 * Accessible: an ordered list in a labelled `nav`, `aria-current="step"` on the active step, and
 * each state is spelled out in hidden text (never color alone).
 */
@Component({
  selector: 'ngcc-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styleUrl: './ngcc-stepper.scss',
  template: `
    <nav [attr.aria-label]="ariaLabel()">
      <ol class="cds--progress" [class.cds--progress--vertical]="vertical()">
        @for (v of views(); track v.index) {
          <li
            class="cds--progress-step"
            [class.cds--progress-step--complete]="v.state === 'complete'"
            [class.cds--progress-step--current]="v.state === 'current'"
            [class.cds--progress-step--incomplete]="v.state === 'incomplete'"
            [class.cds--progress-step--invalid]="v.state === 'invalid'"
            [class.cds--progress-step--disabled]="v.step.disabled"
          >
            <button
              type="button"
              class="cds--progress-step-button"
              [class.cds--progress-step-button--unclickable]="!v.reachable"
              [attr.aria-current]="v.index === current() ? 'step' : null"
              [attr.aria-disabled]="v.reachable ? null : 'true'"
              [attr.tabindex]="v.reachable ? 0 : -1"
              (click)="go(v)"
            >
              <svg
                class="ngcc-stepper__icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                @switch (v.state) {
                  @case ('complete') {
                    <path
                      d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-1 10.5L4 8.5l.9-.9L7 9.7l4.1-4.1.9.9-5 5z"
                    />
                  }
                  @case ('current') {
                    <path
                      d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                    />
                    <circle cx="8" cy="8" r="3.5" />
                  }
                  @case ('invalid') {
                    <path
                      d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm-.8 3h1.6v5H7.2V4zM8 12.3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
                    />
                  }
                  @default {
                    <path
                      d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                    />
                  }
                }
              </svg>
              <span class="cds--progress-text">
                <span class="cds--progress-label">{{ v.step.label }}</span>
                @if (v.step.secondaryLabel) {
                  <span class="cds--progress-optional">{{ v.step.secondaryLabel }}</span>
                }
                <span class="cds--visually-hidden">: {{ v.stateLabel }}</span>
              </span>
              <span class="cds--progress-line"></span>
            </button>
          </li>
        }
      </ol>
    </nav>
  `,
})
export class NgccStepper {
  readonly steps = input.required<readonly NgccStep[]>();
  /** Zero-based index of the active step. */
  readonly current = model(0);
  readonly vertical = input(false);
  /** Only completed steps and the current one are clickable. Turn off to allow any step. */
  readonly linear = input(true);
  readonly ariaLabel = input('Progress');
  /** Emits the step the user navigated to by clicking it. */
  readonly stepChange = output<{ index: number; step: NgccStep }>();

  protected readonly views = computed<NgccStepView[]>(() => {
    const current = this.current();
    const linear = this.linear();
    return this.steps().map((step, index) => {
      const state: NgccStepState = step.invalid
        ? 'invalid'
        : index < current
          ? 'complete'
          : index === current
            ? 'current'
            : 'incomplete';
      const reachable = !step.disabled && (!linear || index <= current);
      return { step, index, state, reachable, stateLabel: STATE_LABEL[state] };
    });
  });

  /** 1-based "Step 2 of 4" text, handy for a live region or a mobile summary. */
  readonly summary = computed(() => `Step ${this.current() + 1} of ${this.steps().length}`);

  protected go(view: NgccStepView): void {
    if (!view.reachable || view.index === this.current()) return;
    this.current.set(view.index);
    this.stepChange.emit({ index: view.index, step: view.step });
  }

  next(): void {
    this.current.update((c) => Math.min(c + 1, this.steps().length - 1));
  }

  previous(): void {
    this.current.update((c) => Math.max(c - 1, 0));
  }
}
