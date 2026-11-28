import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgccTable, NgccTableCellDirective } from './ngcc-table';
import {
  NgccTableColumn,
  NgccTableConfig,
  NgccTableQuery,
  NgccTableRowActionEvent,
} from './ngcc-table.types';

interface Item {
  id: number;
  name: string;
}

const page = (n: number): Item[] =>
  Array.from({ length: 5 }, (_, i) => ({ id: n * 5 + i, name: `Item ${n * 5 + i}` }));

@Component({
  imports: [NgccTable, NgccTableCellDirective],
  template: `
    <ngcc-table
      [columns]="columns"
      [rows]="rows()"
      [loading]="loading()"
      [config]="config()"
      (queryChange)="queries.push($event)"
      (rowAction)="actions.push($event)"
    >
      <ng-template ngccTableCell="name" let-row let-value="value">
        <b class="custom">{{ value }}!</b>
      </ng-template>
    </ngcc-table>
  `,
})
class HostComponent {
  columns: NgccTableColumn<Item>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name' },
  ];
  rows = signal(page(0));
  loading = signal(false);
  config = signal<NgccTableConfig>({
    pagination: true,
    pageSize: 5,
    rowSelection: 'none',
    serverSide: true,
    totalItems: 50,
    rowActions: [
      { id: 'edit', label: 'Edit' },
      { id: 'delete', label: 'Delete', danger: true, visible: (r) => (r as Item).id !== 1 },
    ],
  });
  queries: NgccTableQuery[] = [];
  actions: NgccTableRowActionEvent<Item>[] = [];
}

describe('NgccTable server-side + row actions', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  const el = (): HTMLElement => fixture.nativeElement;
  const flush = async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await flush();
  });

  const names = (): string[] =>
    Array.from(el().querySelectorAll('tbody td .custom')).map((n) => n.textContent ?? '');

  it('shows the rows it is given without slicing or sorting them', () => {
    expect(names()).toHaveLength(5);
    expect(names()[0]).toBe('Item 0!');
  });

  it('emits a query on sort and does not reorder locally', async () => {
    el().querySelector<HTMLButtonElement>('th button.cds--table-sort')!.click();
    await flush();
    expect(host.queries.at(-1)).toMatchObject({
      page: 0,
      pageSize: 5,
      sort: { key: 'id', dir: 'asc' },
    });
    el().querySelector<HTMLButtonElement>('th button.cds--table-sort')!.click();
    await flush();
    expect(host.queries.at(-1)?.sort).toEqual({ key: 'id', dir: 'desc' });
    expect(names()[0]).toBe('Item 0!');
  });

  it('emits a query on page change and keeps the app-provided rows', async () => {
    el().querySelector<HTMLButtonElement>('button[aria-label*="ext" i]')!.click();
    await flush();
    expect(host.queries.at(-1)).toMatchObject({ page: 1, pageSize: 5 });
    host.rows.set(page(1));
    await flush();
    expect(names()[0]).toBe('Item 5!');
  });

  it('uses totalItems for the pager', () => {
    expect(el().querySelector('ngcc-pagination')!.textContent).toContain('50');
  });

  it('shows loading placeholders and marks the body busy', async () => {
    host.loading.set(true);
    await flush();
    expect(el().querySelectorAll('tbody ngcc-skeleton')).not.toHaveLength(0);
    expect(el().querySelector('tbody')!.classList).toContain('ngcc--table-loading');
    expect(el().querySelector('div.cds--data-table-wrapper')!.getAttribute('aria-busy')).toBe(
      'true',
    );
  });

  it('renders a row action menu and honors visible()', async () => {
    const menus = el().querySelectorAll('tbody ngcc-overflow-menu');
    expect(menus).toHaveLength(5);
    menus[0].querySelector<HTMLButtonElement>('button.cds--overflow-menu')!.click();
    await flush();
    expect(menus[0].querySelectorAll('[role=menuitem]')).toHaveLength(2);
    menus[1].querySelector<HTMLButtonElement>('button.cds--overflow-menu')!.click();
    await flush();
    expect(menus[1].querySelectorAll('[role=menuitem]')).toHaveLength(1);
  });

  it('emits rowAction with the row and the action', async () => {
    const menu = el().querySelectorAll('tbody ngcc-overflow-menu')[2];
    menu.querySelector<HTMLButtonElement>('button.cds--overflow-menu')!.click();
    await flush();
    menu.querySelectorAll<HTMLButtonElement>('[role=menuitem]')[1].click();
    await flush();
    expect(host.actions).toHaveLength(1);
    expect(host.actions[0].action.id).toBe('delete');
    expect(host.actions[0].row.id).toBe(2);
    expect(host.actions[0].rowIndex).toBe(2);
  });
});
