export interface NgccStep {
  /** Stable id, used in `stepChange`. Defaults to the index. */
  id?: string;
  label: string;
  /** Small text under the label, e.g. "Optional". */
  secondaryLabel?: string;
  /** Marks the step as having an error; shown instead of "complete". */
  invalid?: boolean;
  disabled?: boolean;
}

export type NgccStepState = 'complete' | 'current' | 'incomplete' | 'invalid';
