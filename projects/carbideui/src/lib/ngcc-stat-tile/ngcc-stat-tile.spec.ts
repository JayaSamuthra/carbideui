import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccStatTile } from './ngcc-stat-tile';

describe('NgccStatTile', () => {
  let fixture: ComponentFixture<NgccStatTile>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccStatTile],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccStatTile);
    fixture.componentRef.setInput('label', 'Users');
    fixture.componentRef.setInput('value', 12);
  });

  it('renders label and value without a delta', async () => {
    await fixture.whenStable();
    expect(el().textContent).toContain('Users');
    expect(el().textContent).toContain('12');
    expect(el().querySelector('.ngcc-stat__delta')).toBeNull();
  });

  it('infers trend from a numeric delta and colors by sentiment', async () => {
    fixture.componentRef.setInput('delta', 5);
    await fixture.whenStable();
    const tile = el().querySelector<HTMLElement>('.ngcc-stat')!;
    expect(tile.style.getPropertyValue('--ngcc-stat-delta')).toContain('success');

    fixture.componentRef.setInput('trendSentiment', 'positive-down');
    await fixture.whenStable();
    expect(tile.style.getPropertyValue('--ngcc-stat-delta')).toContain('error');
  });

  it('sets the accent from status', async () => {
    fixture.componentRef.setInput('status', 'warning');
    await fixture.whenStable();
    expect(
      el().querySelector<HTMLElement>('.ngcc-stat')!.style.getPropertyValue('--ngcc-stat-accent'),
    ).toContain('warning');
  });
});
