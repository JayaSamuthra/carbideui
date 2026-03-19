import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';

import { NgccHeaderGlobal } from './ngcc-header-global';

@Component({
  template: `
    <ngcc-header-global>
      <span class="test-child">Child</span>
    </ngcc-header-global>
  `,
  standalone: true,
  imports: [NgccHeaderGlobal],
})
class TestHeaderGlobalHost {}

describe('NgccHeaderGlobal', () => {
  let fixture: ComponentFixture<TestHeaderGlobalHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderGlobalHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderGlobalHost);
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  describe('Core Functionality', () => {
    it('renders <div class="cds--header__global">', () => {
      detectChanges();
      const el = fixture.debugElement.query(By.css('div.cds--header__global'));
      expect(el).toBeTruthy();
    });

    it('projects children into the container', () => {
      detectChanges();
      const child = fixture.debugElement.query(By.css('.test-child'));
      expect(child).toBeTruthy();
      expect(child.nativeElement.textContent).toBe('Child');
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
