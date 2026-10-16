import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccDateRangePicker, ngccResolveDatePreset } from './ngcc-date-range-picker';
import { runAxe } from '../../test-utils/a11y';

const TODAY = new Date(2026, 9, 16); // 16 Oct 2026

describe('ngccResolveDatePreset', () => {
  it('resolves presets relative to today', () => {
    expect(ngccResolveDatePreset('last-30-days', TODAY)).toEqual({
      start: new Date(2026, 8, 17),
      end: TODAY,
      preset: 'last-30-days',
    });
    expect(ngccResolveDatePreset('this-month', TODAY)).toMatchObject({
      start: new Date(2026, 9, 1),
      end: new Date(2026, 9, 31),
    });
    expect(ngccResolveDatePreset('last-month', TODAY)).toMatchObject({
      start: new Date(2026, 8, 1),
      end: new Date(2026, 8, 30),
    });
  });

  it('returns a null range for custom', () => {
    expect(ngccResolveDatePreset('custom', TODAY)).toEqual({
      start: null,
      end: null,
      preset: 'custom',
    });
  });
});

describe('NgccDateRangePicker', () => {
  let fixture: ComponentFixture<NgccDateRangePicker>;
  const el = () => fixture.nativeElement as HTMLElement;
  const select = () => el().querySelector<HTMLSelectElement>('select')!;
  const dates = () => el().querySelectorAll<HTMLInputElement>('input[type="date"]');
  const type = async (input: HTMLInputElement, v: string) => {
    input.value = v;
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccDateRangePicker],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccDateRangePicker);
    fixture.componentRef.setInput('today', TODAY);
    await fixture.whenStable();
  });

  it('applies a preset to the model', async () => {
    select().value = 'last-7-days';
    select().dispatchEvent(new Event('change'));
    await fixture.whenStable();
    const v = fixture.componentInstance.value();
    expect(v.preset).toBe('last-7-days');
    expect(v.start).toEqual(new Date(2026, 9, 10));
    expect(v.end).toEqual(TODAY);
    expect(dates().length).toBe(0);
  });

  it('shows date inputs for custom and only emits valid ranges', async () => {
    select().value = 'custom';
    select().dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(dates().length).toBe(2);

    await type(dates()[0], '2026-10-10');
    expect(fixture.componentInstance.value().start).toBeNull(); // end still missing

    await type(dates()[1], '2026-10-05');
    expect(el().querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.componentInstance.value().end).toBeNull();

    await type(dates()[1], '2026-10-12');
    expect(el().querySelector('[role="alert"]')).toBeNull();
    expect(fixture.componentInstance.value()).toEqual({
      start: new Date(2026, 9, 10),
      end: new Date(2026, 9, 12),
      preset: 'custom',
    });
  });

  it('reflects an externally set value', async () => {
    fixture.componentRef.setInput('value', ngccResolveDatePreset('this-month', TODAY));
    await fixture.whenStable();
    expect(select().value).toBe('this-month');
  });

  it('has no accessibility violations', async () => {
    select().value = 'custom';
    select().dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(await runAxe(el())).toHaveNoViolations();
  });
});
