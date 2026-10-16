import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccFilterBar, NgccFilterField } from './ngcc-filter-bar';
import { runAxe } from '../../test-utils/a11y';

const fields: NgccFilterField[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Running', value: 'running' },
      { label: 'Stopped', value: 'stopped' },
    ],
  },
  { key: 'region', label: 'Region', options: [{ label: 'US East', value: 'us-east' }] },
];

describe('NgccFilterBar', () => {
  let fixture: ComponentFixture<NgccFilterBar>;
  const el = () => fixture.nativeElement as HTMLElement;
  const input = () => el().querySelector<HTMLInputElement>('input')!;
  const options = () => Array.from(el().querySelectorAll<HTMLElement>('[role="option"]'));
  const chips = () =>
    Array.from(el().querySelectorAll('ngcc-tag')).map((t) => t.textContent!.trim());
  const key = async (k: string) => {
    input().dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
  };
  const typeText = async (v: string) => {
    input().value = v;
    input().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccFilterBar],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccFilterBar);
    fixture.componentRef.setInput('fields', fields);
    await fixture.whenStable();
    input().dispatchEvent(new Event('focus'));
    await fixture.whenStable();
  });

  it('exposes combobox semantics and lists suggestions on focus', () => {
    expect(input().getAttribute('role')).toBe('combobox');
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(options().length).toBe(3);
  });

  it('narrows suggestions and updates the query', async () => {
    await typeText('stop');
    expect(options().map((o) => o.textContent!.trim())).toEqual(['Status: Stopped']);
    expect(fixture.componentInstance.value().query).toBe('stop');
  });

  it('adds a chip with keyboard selection and clears the query', async () => {
    await typeText('run');
    await key('ArrowDown');
    expect(input().getAttribute('aria-activedescendant')).toBe(options()[0].id);
    await key('Enter');
    expect(fixture.componentInstance.value()).toEqual({
      query: '',
      filters: { status: ['running'] },
    });
    expect(chips()).toEqual(['Status: Running']);
    expect(options().map((o) => o.textContent!.trim())).not.toContain('Status: Running');
  });

  it('adds a chip on mousedown and removes the last chip with Backspace', async () => {
    options()[2].dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.value().filters).toEqual({ region: ['us-east'] });
    await key('Backspace');
    expect(fixture.componentInstance.value().filters).toEqual({});
  });

  it('Escape closes the list, then clears the query', async () => {
    await typeText('x');
    await key('Escape');
    expect(input().getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.value().query).toBe('x');
    await key('Escape');
    expect(fixture.componentInstance.value().query).toBe('');
  });

  it('Clear all resets everything', async () => {
    fixture.componentRef.setInput('value', { query: 'abc', filters: { status: ['running'] } });
    await fixture.whenStable();
    el().querySelector<HTMLButtonElement>('.ngcc-fb__clear')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toEqual({ query: '', filters: {} });
    expect(el().querySelector('.ngcc-fb__clear')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    expect(await runAxe(el())).toHaveNoViolations();
  });
});
