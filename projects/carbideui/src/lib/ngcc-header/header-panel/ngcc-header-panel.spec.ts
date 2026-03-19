import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';

import { NgccHeaderPanel } from './ngcc-header-panel';

@Component({
  template: `
    <ngcc-header-panel [expanded]="expanded" [ariaLabel]="ariaLabel">
      <p class="panel-content">Panel content</p>
    </ngcc-header-panel>
  `,
  standalone: true,
  imports: [NgccHeaderPanel],
})
class TestHeaderPanelHost {
  expanded = false;
  ariaLabel = 'Notifications';
}

describe('NgccHeaderPanel', () => {
  let fixture: ComponentFixture<TestHeaderPanelHost>;
  let host: TestHeaderPanelHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderPanelHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderPanelHost);
    host = fixture.componentInstance;
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  function getPanel() {
    return fixture.debugElement.query(By.css('[role="complementary"]'));
  }

  describe('Core Functionality', () => {
    it('renders a div with role="complementary"', () => {
      detectChanges();
      expect(getPanel()).toBeTruthy();
    });

    it('applies cds--header-panel class', () => {
      detectChanges();
      expect(getPanel().nativeElement.classList).toContain('cds--header-panel');
    });

    it('sets aria-label', () => {
      host.ariaLabel = 'Notifications';
      detectChanges();
      expect(getPanel().nativeElement.getAttribute('aria-label')).toBe('Notifications');
    });

    it('projects children into the panel', () => {
      detectChanges();
      const content = fixture.debugElement.query(By.css('.panel-content'));
      expect(content).toBeTruthy();
      expect(content.nativeElement.textContent.trim()).toBe('Panel content');
    });
  });

  describe('Expanded State', () => {
    it('does not have expanded class when collapsed', () => {
      host.expanded = false;
      detectChanges();
      expect(getPanel().nativeElement.classList).not.toContain('cds--header-panel--expanded');
    });

    it('adds expanded class when expanded is true', () => {
      host.expanded = true;
      detectChanges();
      expect(getPanel().nativeElement.classList).toContain('cds--header-panel--expanded');
    });

    it('aria-hidden is "true" when collapsed', () => {
      host.expanded = false;
      detectChanges();
      expect(getPanel().nativeElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('aria-hidden is "false" when expanded', () => {
      host.expanded = true;
      detectChanges();
      expect(getPanel().nativeElement.getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('WCAG & Accessibility', () => {
    it('should have no accessibility violations when collapsed', async () => {
      host.expanded = false;
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when expanded', async () => {
      host.expanded = true;
      detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
