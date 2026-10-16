import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccActivityFeed } from './ngcc-activity-feed';

describe('NgccActivityFeed', () => {
  let fixture: ComponentFixture<NgccActivityFeed>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccActivityFeed],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccActivityFeed);
  });

  it('shows the empty text with no items', async () => {
    await fixture.whenStable();
    expect(el().querySelector('ol')).toBeNull();
    expect(el().textContent).toContain('No recent activity');
  });

  it('renders items with status and variant classes', async () => {
    fixture.componentRef.setInput('variant', 'timeline');
    fixture.componentRef.setInput('items', [
      { id: 1, title: 'deployed', actor: 'Ann', status: 'success', timestamp: '1h ago' },
      { id: 2, title: 'failed', status: 'error' },
    ]);
    await fixture.whenStable();
    expect(el().querySelector('ol')!.classList).toContain('ngcc-feed--timeline');
    const items = el().querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].classList).toContain('ngcc-feed__item--success');
    expect(items[0].textContent).toContain('Ann');
    expect(items[1].querySelector('time')).toBeNull();
  });
});
