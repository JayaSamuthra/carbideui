import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccHeaderNavigation } from './ngcc-header-navigation';
import { runAxe } from '../../../test-utils/a11y';

@Component({
  template: `<ngcc-header-navigation [ariaLabel]="ariaLabel" />`,
  standalone: true,
  imports: [NgccHeaderNavigation],
})
class TestHeaderNavHost {
  ariaLabel = 'Main navigation';
}

describe('NgccHeaderNavigation', () => {
  let fixture: ComponentFixture<TestHeaderNavHost>;
  let host: TestHeaderNavHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderNavHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderNavHost);
    host = fixture.componentInstance;
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  describe('Core Functionality', () => {
    it('renders <nav> with cds--header__nav class', () => {
      detectChanges();
      const nav = fixture.debugElement.query(By.css('nav.cds--header__nav'));
      expect(nav).toBeTruthy();
    });

    it('sets aria-label on <nav>', () => {
      host.ariaLabel = 'Product navigation';
      detectChanges();
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Product navigation');
    });

    it('renders <ul> with role="menubar"', () => {
      detectChanges();
      const ul = fixture.debugElement.query(By.css('ul[role="menubar"]'));
      expect(ul).toBeTruthy();
    });

    it('ul has cds--header__menu-bar class', () => {
      detectChanges();
      const ul = fixture.debugElement.query(By.css('ul'));
      expect(ul.nativeElement.classList).toContain('cds--header__menu-bar');
    });

    it('sets aria-label on <ul>', () => {
      host.ariaLabel = 'Product navigation';
      detectChanges();
      const ul = fixture.debugElement.query(By.css('ul'));
      expect(ul.nativeElement.getAttribute('aria-label')).toBe('Product navigation');
    });
  });

  describe('WCAG & Accessibility', () => {
    it('should have no accessibility violations', async () => {
      detectChanges();
      const results = await runAxe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
