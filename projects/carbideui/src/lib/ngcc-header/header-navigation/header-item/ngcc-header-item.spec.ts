import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';

import { NgccHeaderItem } from './ngcc-header-item';

@Component({
  template: `
    <ul role="menubar">
      <ngcc-header-item
        [href]="href"
        [isCurrentPage]="isCurrentPage"
        [tabIndex]="tabIndex"
        (itemClick)="onItemClick($event)"
        >Dashboard</ngcc-header-item
      >
    </ul>
  `,
  standalone: true,
  imports: [NgccHeaderItem],
})
class TestHeaderItemHost {
  href = '/dashboard';
  isCurrentPage = false;
  tabIndex = 0;
  onItemClick = (_e: Event) => {};
}

describe('NgccHeaderItem', () => {
  let fixture: ComponentFixture<TestHeaderItemHost>;
  let host: TestHeaderItemHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderItemHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderItemHost);
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
    it('renders <li role="none"> wrapper', () => {
      detectChanges();
      const li = fixture.debugElement.query(By.css('li'));
      expect(li.nativeElement.getAttribute('role')).toBe('none');
    });

    it('renders <a role="menuitem"> link', () => {
      detectChanges();
      expect(getLink()).toBeTruthy();
    });

    it('sets href attribute', () => {
      host.href = '/reports';
      detectChanges();
      expect(getLink().nativeElement.getAttribute('href')).toBe('/reports');
    });

    it('applies cds--header__menu-item class', () => {
      detectChanges();
      expect(getLink().nativeElement.classList).toContain('cds--header__menu-item');
    });

    it('renders projected content', () => {
      detectChanges();
      expect(getLink().nativeElement.textContent).toContain('Dashboard');
    });

    it('sets tabindex from tabIndex input', () => {
      host.tabIndex = -1;
      detectChanges();
      expect(getLink().nativeElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Current Page State', () => {
    it('adds cds--header__menu-item--current when isCurrentPage is true', () => {
      host.isCurrentPage = true;
      detectChanges();
      expect(getLink().nativeElement.classList).toContain('cds--header__menu-item--current');
    });

    it('does not add current class when isCurrentPage is false', () => {
      host.isCurrentPage = false;
      detectChanges();
      expect(getLink().nativeElement.classList).not.toContain('cds--header__menu-item--current');
    });

    it('sets aria-current="page" when isCurrentPage is true', () => {
      host.isCurrentPage = true;
      detectChanges();
      expect(getLink().nativeElement.getAttribute('aria-current')).toBe('page');
    });

    it('removes aria-current when isCurrentPage is false', () => {
      host.isCurrentPage = false;
      detectChanges();
      expect(getLink().nativeElement.getAttribute('aria-current')).toBeNull();
    });
  });

  describe('Events', () => {
    it('emits itemClick on anchor click', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      detectChanges();
      getLink().nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('emits itemClick on Enter keydown', () => {
      const spy = vi.spyOn(host, 'onItemClick');
      detectChanges();
      getLink().nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      expect(spy).toHaveBeenCalled();
    });

    it('emits itemClick on Space keydown', () => {
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
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
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

    it('should have no accessibility violations for current page', async () => {
      host.isCurrentPage = true;
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
