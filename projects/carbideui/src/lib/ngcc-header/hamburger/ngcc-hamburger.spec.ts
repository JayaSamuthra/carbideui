import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';

import { NgccHamburger } from './ngcc-hamburger';

@Component({
  template: ` <ngcc-hamburger [(active)]="active" [label]="label" [labelClose]="labelClose" /> `,
  standalone: true,
  imports: [NgccHamburger],
})
class TestHamburgerHost {
  active = false;
  label = 'Open navigation menu';
  labelClose = 'Close navigation menu';
}

describe('NgccHamburger', () => {
  let fixture: ComponentFixture<TestHamburgerHost>;
  let host: TestHamburgerHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHamburgerHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHamburgerHost);
    host = fixture.componentInstance;
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  function getButton() {
    return fixture.debugElement.query(By.css('button'));
  }

  describe('Core Functionality', () => {
    it('renders a button element', () => {
      detectChanges();
      expect(getButton()).toBeTruthy();
    });

    it('shows label as aria-label when inactive', () => {
      host.label = 'Open nav';
      host.active = false;
      detectChanges();
      expect(getButton().nativeElement.getAttribute('aria-label')).toBe('Open nav');
    });

    it('shows labelClose as aria-label when active', () => {
      host.labelClose = 'Close nav';
      host.active = true;
      detectChanges();
      expect(getButton().nativeElement.getAttribute('aria-label')).toBe('Close nav');
    });

    it('aria-expanded is false when inactive', () => {
      host.active = false;
      detectChanges();
      expect(getButton().nativeElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('aria-expanded is true when active', () => {
      host.active = true;
      detectChanges();
      expect(getButton().nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('button has cds--header__action and cds--header__menu-trigger classes', () => {
      detectChanges();
      const btn = getButton().nativeElement;
      expect(btn.classList).toContain('cds--header__action');
      expect(btn.classList).toContain('cds--header__menu-trigger');
    });
  });

  describe('Toggle Behavior', () => {
    it('adds cds--header__action--active class when active', () => {
      host.active = true;
      detectChanges();
      expect(getButton().nativeElement.classList).toContain('cds--header__action--active');
    });

    it('does not add active class when inactive', () => {
      host.active = false;
      detectChanges();
      expect(getButton().nativeElement.classList).not.toContain('cds--header__action--active');
    });

    it('clicking the button sets active to true', () => {
      host.active = false;
      detectChanges();
      getButton().nativeElement.click();
      detectChanges();
      expect(host.active).toBe(true);
    });

    it('clicking again toggles active back to false', () => {
      host.active = true;
      detectChanges();
      getButton().nativeElement.click();
      detectChanges();
      expect(host.active).toBe(false);
    });
  });

  describe('WCAG & Accessibility', () => {
    it('should have no accessibility violations when inactive', async () => {
      host.active = false;
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when active', async () => {
      host.active = true;
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
