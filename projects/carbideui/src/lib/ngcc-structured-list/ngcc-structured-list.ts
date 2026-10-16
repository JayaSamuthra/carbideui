import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface NgccStructuredListColumn {
  key: string;
  header: string;
}

export type NgccStructuredListRow = Record<string, string | number | null | undefined> & {
  id?: string | number;
};

/** Data-driven Carbon structured list (read-only, key/value style rows). */
@Component({
  selector: 'ngcc-structured-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  template: `
    <div
      [class]="'cds--structured-list' + (condensed() ? ' cds--structured-list--condensed' : '')"
      role="table"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="cds--structured-list-thead" role="rowgroup">
        <div class="cds--structured-list-row cds--structured-list-row--header-row" role="row">
          @for (col of columns(); track col.key) {
            <div class="cds--structured-list-th" role="columnheader">{{ col.header }}</div>
          }
        </div>
      </div>
      <div class="cds--structured-list-tbody" role="rowgroup">
        @for (row of rows(); track row.id ?? $index) {
          <div class="cds--structured-list-row" role="row">
            @for (col of columns(); track col.key) {
              <div class="cds--structured-list-td" role="cell">{{ row[col.key] ?? '' }}</div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class NgccStructuredList {
  readonly columns = input<NgccStructuredListColumn[]>([]);
  readonly rows = input<NgccStructuredListRow[]>([]);
  readonly condensed = input(false);
  readonly ariaLabel = input('Structured list');
}
