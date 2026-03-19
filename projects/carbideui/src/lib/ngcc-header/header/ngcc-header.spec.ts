import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';

import { NgccHeader } from './ngcc-header';

@Component({
  template: `<ngcc-header [ariaLabel]="ariaLabel" [skipTo]="skipTo"></ngcc-header>`,
  standalone: true,
  imports: [NgccHeader],
})
class TestHeaderHost {
  ariaLabel = 'My App';
  skipTo = 'main-content';
}

describe('NgccHeader', () => {
  let fixture: ComponentFixture<TestHeaderHost>;
  let host: TestHeaderHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderHost);
    host = fixture.componentInstance;
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  function getHeader() {
    return fixture.debugElement.query(By.css('header'));
  }

  describe('Core Functionality', () => {
    it('renders <header> element with cds--header class', () => {
      detectChanges();
      expect(getHeader()).toBeTruthy();
      expect(getHeader().nativeElement.classList).toContain('cds--header');
    });

    it('has role="banner"', () => {
      detectChanges();
      expect(getHeader().nativeElement.getAttribute('role')).toBe('banner');
    });

    it('sets aria-label from ariaLabel input', () => {
      host.ariaLabel = 'My Product';
      detectChanges();
      expect(getHeader().nativeElement.getAttribute('aria-label')).toBe('My Product');
    });

    it('does not set aria-label when ariaLabel is empty', () => {
      host.ariaLabel = '';
      detectChanges();
      expect(getHeader().nativeElement.getAttribute('aria-label')).toBeNull();
    });
  });

  describe('Skip Link', () => {
    it('renders skip link when skipTo is provided', () => {
      host.skipTo = 'main-content';
      detectChanges();
      const skipLink = fixture.debugElement.query(By.css('.cds--skip-to-content'));
      expect(skipLink).toBeTruthy();
    });

    it('skip link href points to #<skipTo>', () => {
      host.skipTo = 'main-content';
      detectChanges();
      const skipLink = fixture.debugElement.query(By.css('.cds--skip-to-content'));
      expect(skipLink.nativeElement.getAttribute('href')).toBe('#main-content');
    });

    it('skip link text is "Skip to main content"', () => {
      host.skipTo = 'main-content';
      detectChanges();
      const skipLink = fixture.debugElement.query(By.css('.cds--skip-to-content'));
      expect(skipLink.nativeElement.textContent.trim()).toBe('Skip to main content');
    });

    it('does not render skip link when skipTo is empty', () => {
      host.skipTo = '';
      detectChanges();
      const skipLink = fixture.debugElement.query(By.css('.cds--skip-to-content'));
      expect(skipLink).toBeFalsy();
    });

    it('skip link is focusable (tabindex="0")', () => {
      host.skipTo = 'main-content';
      detectChanges();
      const skipLink = fixture.debugElement.query(By.css('.cds--skip-to-content'));
      expect(skipLink.nativeElement.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('WCAG & Accessibility', () => {
    it('should have no accessibility violations', async () => {
      host.ariaLabel = 'Test App';
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
