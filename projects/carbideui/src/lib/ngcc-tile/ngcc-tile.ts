import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Tile / card with optional header, body, footer and action slots.
 *
 * Slots (content projection):
 *  - `[ngccTileHeader]` — header content (or use the `heading` input)
 *  - default            — body
 *  - `[ngccTileAction]` — action area in the header (e.g. an icon button)
 *  - `[ngccTileFooter]` — footer content
 *
 * Set `href` to render the whole tile as a link, or `clickable` to make it a button.
 */
@Component({
  selector: 'ngcc-tile',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
  styleUrl: './ngcc-tile.scss',
  template: `
    @if (href(); as link) {
      <a
        class="cds--tile cds--tile--clickable"
        [class.cds--tile--light]="light()"
        [attr.href]="link"
        (click)="activated.emit($event)"
      >
        <ng-container *ngTemplateOutlet="content" />
      </a>
    } @else if (clickable()) {
      <button
        type="button"
        class="cds--tile cds--tile--clickable"
        [class.cds--tile--light]="light()"
        [disabled]="disabled()"
        (click)="activated.emit($event)"
      >
        <ng-container *ngTemplateOutlet="content" />
      </button>
    } @else {
      <div class="cds--tile" [class.cds--tile--light]="light()">
        <ng-container *ngTemplateOutlet="content" />
      </div>
    }

    <ng-template #content>
      <div class="ngcc-tile__header">
        @if (heading()) {
          <h3 class="ngcc-tile__heading">{{ heading() }}</h3>
        }
        <ng-content select="[ngccTileHeader]" />
        <ng-content select="[ngccTileAction]" />
      </div>
      <div class="ngcc-tile__body"><ng-content /></div>
      <div class="ngcc-tile__footer"><ng-content select="[ngccTileFooter]" /></div>
    </ng-template>
  `,
})
export class NgccTile {
  readonly heading = input('');
  /** Renders the tile as an anchor. */
  readonly href = input<string | undefined>(undefined);
  /** Renders the tile as a button. */
  readonly clickable = input(false);
  readonly disabled = input(false);
  /** Use on layers that already have a `$layer` background. */
  readonly light = input(false);

  readonly activated = output<Event>();
}
