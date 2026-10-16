import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccOverflowMenu, NgccOverflowMenuItem } from './ngcc-overflow-menu';
import { runAxe } from '../../test-utils/a11y';

const items: NgccOverflowMenuItem[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'share', label: 'Share', disabled: true },
  { id: 'delete', label: 'Delete', danger: true, divider: true },
];

describe('NgccOverflowMenu', () => {
  let fixture: ComponentFixture<NgccOverflowMenu>;
  const el = () => fixture.nativeElement as HTMLElement;
  const trigger = () => el().querySelector<HTMLButtonElement>('button.cds--overflow-menu')!;
  const menu = () => el().querySelector('[role="menu"]');
  const menuItems = () => Array.from(el().querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
  const press = async (target: HTMLElement, k: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccOverflowMenu],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccOverflowMenu);
    fixture.componentRef.setInput('items', items);
    document.body.appendChild(el());
    await fixture.whenStable();
  });

  afterEach(() => el().remove());

  it('is closed by default and toggles on click', async () => {
    expect(menu()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    trigger().click();
    await fixture.whenStable();
    expect(menu()).not.toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    trigger().click();
    await fixture.whenStable();
    expect(menu()).toBeNull();
  });

  it('focuses the first item on open and skips disabled items with arrows', async () => {
    trigger().click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(menuItems()[0]);
    await press(menu() as HTMLElement, 'ArrowDown');
    expect(document.activeElement).toBe(menuItems()[2]);
    await press(menu() as HTMLElement, 'ArrowDown');
    expect(document.activeElement).toBe(menuItems()[0]);
    await press(menu() as HTMLElement, 'End');
    expect(document.activeElement).toBe(menuItems()[2]);
  });

  it('opens with ArrowDown on the trigger', async () => {
    await press(trigger(), 'ArrowDown');
    expect(menu()).not.toBeNull();
  });

  it('Escape closes and returns focus to the trigger', async () => {
    trigger().click();
    await fixture.whenStable();
    await press(menu() as HTMLElement, 'Escape');
    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('emits itemSelected, closes, and ignores disabled items', async () => {
    const picked: NgccOverflowMenuItem[] = [];
    fixture.componentInstance.itemSelected.subscribe((i) => picked.push(i));
    trigger().click();
    await fixture.whenStable();
    expect(menuItems()[1].disabled).toBe(true);
    menuItems()[2].click();
    await fixture.whenStable();
    expect(picked).toEqual([items[2]]);
    expect(menu()).toBeNull();
  });

  it('closes on outside click', async () => {
    trigger().click();
    await fixture.whenStable();
    document.body.click();
    await fixture.whenStable();
    expect(menu()).toBeNull();
  });

  it('applies danger styling and positions the menu', async () => {
    trigger().click();
    await fixture.whenStable();
    expect(el().querySelector('.cds--overflow-menu-options__option--danger')).not.toBeNull();
    expect((menu() as HTMLElement).style.getPropertyValue('--ngcc-overflow-right')).not.toBe('');
  });

  it('has no accessibility violations (open)', async () => {
    trigger().click();
    await fixture.whenStable();
    expect(await runAxe(el())).toHaveNoViolations();
  });
});
