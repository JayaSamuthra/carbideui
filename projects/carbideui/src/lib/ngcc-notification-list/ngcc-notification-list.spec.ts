import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccNotificationList, NgccNotificationItem } from './ngcc-notification-list';
import { runAxe } from '../../test-utils/a11y';

describe('NgccNotificationList', () => {
  let fixture: ComponentFixture<NgccNotificationList>;
  const el = () => fixture.nativeElement as HTMLElement;
  const items: NgccNotificationItem[] = [
    { id: 1, title: 'A', read: false },
    { id: 2, title: 'B', read: true },
    { id: 3, title: 'C' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccNotificationList],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccNotificationList);
    fixture.componentRef.setInput('items', items);
    await fixture.whenStable();
  });

  it('shows the unread count', () => {
    expect(el().querySelector('.ngcc-notif__count')!.textContent).toContain('2');
  });

  it('emits markAllRead and clear', () => {
    const c = fixture.componentInstance;
    let marked = 0;
    let cleared = 0;
    c.markAllRead.subscribe(() => marked++);
    c.clear.subscribe(() => cleared++);
    const [markBtn, clearBtn] = Array.from(
      el().querySelectorAll<HTMLButtonElement>('.ngcc-notif__link'),
    );
    markBtn.click();
    clearBtn.click();
    expect([marked, cleared]).toEqual([1, 1]);
  });

  it('emits itemClicked and dismissed with the item', () => {
    const c = fixture.componentInstance;
    const clicked: unknown[] = [];
    const dismissed: unknown[] = [];
    c.itemClicked.subscribe((i) => clicked.push(i));
    c.dismissed.subscribe((i) => dismissed.push(i));
    el().querySelector<HTMLButtonElement>('.ngcc-notif__main')!.click();
    el().querySelector<HTMLButtonElement>('.ngcc-notif__dismiss')!.click();
    expect(clicked).toEqual([items[0]]);
    expect(dismissed).toEqual([items[0]]);
  });

  it('disables mark-all-read when everything is read, and shows empty text with no items', async () => {
    fixture.componentRef.setInput('items', [{ id: 1, title: 'A', read: true }]);
    await fixture.whenStable();
    expect(el().querySelector<HTMLButtonElement>('.ngcc-notif__link')!.disabled).toBe(true);
    expect(el().querySelector('.ngcc-notif__count')).toBeNull();
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    expect(el().textContent).toContain("You're all caught up");
  });

  it('has no accessibility violations', async () => {
    expect(await runAxe(el())).toHaveNoViolations();
  });
});
