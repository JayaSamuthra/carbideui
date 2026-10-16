import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccProgressBar } from './ngcc-progress-bar';

describe('NgccProgressBar', () => {
  let fixture: ComponentFixture<NgccProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccProgressBar],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccProgressBar);
    fixture.componentRef.setInput('label', 'CPU');
  });

  async function set(value: number, extra: Record<string, unknown> = {}) {
    fixture.componentRef.setInput('value', value);
    for (const [k, v] of Object.entries(extra)) fixture.componentRef.setInput(k, v);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is normal below the warning threshold', async () => {
    await set(40);
    expect(fixture.componentInstance.level()).toBe('normal');
    expect(fixture.nativeElement.querySelector('.cds--progress-bar--error')).toBeNull();
  });

  it('warns at the warning threshold', async () => {
    const el = await set(75);
    expect(fixture.componentInstance.level()).toBe('warning');
    expect(
      el.querySelector<HTMLElement>('.cds--progress-bar__bar')!.style.backgroundColor,
    ).toContain('--cds-support-warning');
  });

  it('is critical at the critical threshold and uses the error class', async () => {
    const el = await set(95);
    expect(fixture.componentInstance.level()).toBe('critical');
    expect(el.querySelector('.cds--progress-bar--error')).not.toBeNull();
  });

  it('finishes at max when finishAtMax is set', async () => {
    await set(100, { finishAtMax: true });
    expect(fixture.componentInstance.level()).toBe('finished');
  });

  it('clamps out-of-range values and exposes aria attributes', async () => {
    const el = await set(150);
    const track = el.querySelector('[role="progressbar"]')!;
    expect(track.getAttribute('aria-valuenow')).toBe('100');
    expect(track.getAttribute('aria-labelledby')).toBeTruthy();
  });
});
