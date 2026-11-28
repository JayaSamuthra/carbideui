import type { NgccTagType } from '../ngcc-tag/ngcc-tag';
import type { NgccOverflowMenuItem } from '../ngcc-overflow-menu/ngcc-overflow-menu';

export type SortDirection = 'asc' | 'desc';

export interface NgccTableColumn<T = unknown> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'start' | 'center' | 'end';
  /**
   * `status` renders the value as a status tag (dot + text, so color is never the only signal).
   * Default `text`.
   */
  cell?: 'text' | 'status';
  /** For `cell: 'status'`: value -> tag color. Unmapped values use the built-in status names
   * (running, success, pending, warning, error, stopped) and fall back to gray. */
  statusMap?: Record<string, NgccTagType>;
  /**
   * Shows an editor in every row of this column. `text` and `number` render an input, `select`
   * renders a select over `options`. Edits are written to the row object (the `rows` array is not
   * replaced, so selection, sorting and paging stay) and reported by `cellEdit`.
   * A `<ng-template ngccTableCell="key">` takes precedence over the built-in editors.
   */
  editor?: 'text' | 'number' | 'select';
  /** For `editor: 'select'`. */
  options?: { value: string | number; label: string }[];
  /** For `editor: 'number'`: native range hints (`min`, `max`, `step`). */
  min?: number;
  max?: number;
  step?: number;
  /** Returns an error message for the value, or `null` when it is fine. Runs on every edit. */
  validate?: (value: unknown, row: T) => string | null;
}

export interface NgccTableCellEdit<T = unknown> {
  row: T;
  /** Position of the row in the `rows` input. */
  rowIndex: number;
  key: string;
  value: unknown;
  previous: unknown;
  /** Validation message for this cell after the edit, or `null`. */
  error: string | null;
}

/** A row action shown in the row's overflow menu. */
export interface NgccTableRowAction<T = unknown> extends Omit<NgccOverflowMenuItem, 'disabled'> {
  /** Return `true` to disable the action for a row. */
  disabled?: boolean | ((row: T) => boolean);
  /** Return `false` to hide the action for a row. */
  visible?: (row: T) => boolean;
}

/** Emitted when a row action is chosen. */
export interface NgccTableRowActionEvent<T = unknown> {
  action: NgccTableRowAction<T>;
  row: T;
  /** Position of the row in the `rows` input. */
  rowIndex: number;
}

/** What the server needs to return the next set of rows (`config.serverSide`). */
export interface NgccTableQuery {
  /** Zero-based page. */
  page: number;
  pageSize: number;
  sort: { key: string; dir: SortDirection } | null;
  search: string;
}

export interface NgccTableConfig {
  pagination?: boolean;
  pageSize?: number;
  /**
   * Server-driven table. `rows` holds only the current page, and the table does not sort, filter
   * or slice it. Paging, sorting and search emit `queryChange`; set `loading` while fetching and
   * `totalItems` to the full row count.
   */
  serverSide?: boolean;
  /** Total number of rows on the server (server-side mode). Defaults to `rows.length`. */
  totalItems?: number;
  /** Row action menu column. Choosing an item emits `rowAction`. */
  rowActions?: NgccTableRowAction[];
  rowSelection?: 'single' | 'multiple' | 'none';
  /** Set to `false` to hide the expand column even when an expanded-row template is provided. */
  expandable?: boolean;
  search?: {
    enabled?: boolean;
    mode?: 'static' | 'dynamic'; // static filters locally, dynamic emits event (always dynamic when serverSide)
  };
}
