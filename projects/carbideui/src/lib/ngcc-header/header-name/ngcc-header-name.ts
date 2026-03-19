import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Brand prefix + product name link in the header.
 *
 * <ngcc-header-name brand="CarbideUI" productName="My App" href="/" />
 */
@Component({
  selector: 'ngcc-header-name',
  standalone: true,
  imports: [],
  templateUrl: './ngcc-header-name.html',
  styleUrls: ['./ngcc-header-name.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'none' },
})
export class NgccHeaderName {
  /** Brand prefix, e.g. "CarbideUI" */
  readonly brand = input('CarbideUI');
  /** Product / suite name shown after the brand */
  readonly productName = input('');
  /** Link destination */
  readonly href = input('/');

  /** Combined title attribute for accessibility */
  readonly titleAttr = computed(() => [this.brand(), this.productName()].filter(Boolean).join(' '));
}
