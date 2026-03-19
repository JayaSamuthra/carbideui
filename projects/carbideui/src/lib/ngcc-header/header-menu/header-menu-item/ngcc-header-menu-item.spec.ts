import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';
import { NgccHeaderMenuItem } from './ngcc-header-menu-item';

@Component({
  template: `
    <ul role="menu">
      <ngcc-header-menu-item
        [href]="href"
        [isCurrentPage]="isCurrentPage"
        [disabled]="disabled"
        (itemClick)="onItemClick($event)"
        >Profile</ngcc-header-menu-item
      >
    </ul>
  `,
  standalone: true,
  imports: [NgccHeaderMenuItem],
})
class TestHeaderMenuItemHost {
  href = '/profile';
  isCurrentPage = false;
  disabled = false;
  onItemClick = (_e: Event) => {};
}

describe('NgccHeaderMenuItem', () => {
  let fixture: ComponentFixture<TestHeaderMenuItemHost>;
  let host: TestHeaderMenuItemHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderMenuItemHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderMenuItemHost);
    host = fixture.componentInstance;
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  function getLink() {
    return fixture.debugElement.query(By.css('a[role="menuitem"]'));
  }

  describe('Core Functionality', () => {
    it('renders <a role="menuitem"> link', () => {
      detectChanges();
      expect(getLink()).toBeTruthy();
    });

    it('sets href attribute', () => {
      host.href = '/settings';
      detectChanges();
      expect(getLink().nativeElement.getAttribute('href')).toBe('/settings');
    });

    it('applies cds--header__menu-item class', () => {
      detectChanges();
      expect(getLink().nativeElement.classList).toContain('cds--header__menu-item');
    });

    it('renders projected content', () => {
      detectChanges();
      expect(getLink().nativeElement.textContent).toContain('Profile');
    });

    it('adds current class and aria-current when isCurrentPage is true', () => {
      host.isCurrentPage = true;
      detectChanges();
      expect(getLink().nativeElement.classList).toContain('cds--header__menu-item--current');
      expect(getLink().nativeElement.getAttribute('aria-current')).toBe('page');
    });

    it('does not add current class when isCurrentPage is false', () => {
      host.isCurrentPage = false;
      detectChanges();
      expect(getLink().nativeElement.classList).not.toContain('cds--header__menu-item--current');
      expect(getLink().nativeElement.getAttribute('aria-current')).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('removes href when disabled', () => {
      host.disabled = true;
      detectChanges();
      expect(getLink().nativeElement.getAttribute('href')).toBeNull();
    });

    it('sets aria-disabled="true" when disabled', () => {
      host.disabled = true;
      detectChanges();
      expect(getLink().nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not set aria-disabled when enabled', () => {
      host.disabled = false;
      detectChanges();
      expect(getLink().nativeElement.getAttribute('aria-disabled')).toBeNull();
    });

    it('does not emit itemClick when disabled and clicked', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      host.disabled = true;
      detectChanges();
      getLink().nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not emit itemClick on Enter when disabled', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      host.disabled = true;
      detectChanges();
      getLink().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not emit itemClick on Space when disabled', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      host.disabled = true;
      detectChanges();
      getLink().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('emits itemClick on click when not disabled', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      detectChanges();
      getLink().nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(spy).toHaveBeenCalled();
    });

    it('emits itemClick on Enter keydown when not disabled', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      detectChanges();
      getLink().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      expect(spy).toHaveBeenCalled();
    });

    it('emits itemClick on Space keydown when not disabled', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      detectChanges();
      getLink().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
      );
      expect(spy).toHaveBeenCalled();
    });

    it('does not emit itemClick on other keys', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      detectChanges();
      getLink().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('WCAG & Accessibility', () => {
    it('should have no accessibility violations', async () => {
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
