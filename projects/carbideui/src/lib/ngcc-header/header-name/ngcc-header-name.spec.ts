import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { axe } from 'vitest-axe';

import { NgccHeaderName } from './ngcc-header-name';
@Component({
  template: ` <ngcc-header-name [brand]="brand" [productName]="productName" [href]="href" /> `,
  standalone: true,
  imports: [NgccHeaderName],
})
class TestHeaderNameHost {
  brand = 'CarbideUI';
  productName = 'My App';
  href = '/home';
}

describe('NgccHeaderName', () => {
  let fixture: ComponentFixture<TestHeaderNameHost>;
  let host: TestHeaderNameHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHeaderNameHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHeaderNameHost);
    host = fixture.componentInstance;
  });

  function detectChanges() {
    fixture.detectChanges();
    fixture.whenStable?.();
  }

  function getLink() {
    return fixture.debugElement.query(By.css('a.cds--header__name'));
  }

  describe('Core Functionality', () => {
    it('renders a link with cds--header__name class', () => {
      detectChanges();
      expect(getLink()).toBeTruthy();
    });

    it('sets the href attribute', () => {
      host.href = '/dashboard';
      detectChanges();
      expect(getLink().nativeElement.getAttribute('href')).toBe('/dashboard');
    });

    it('renders brand prefix in cds--header__name--prefix span', () => {
      host.brand = 'CarbideUI';
      detectChanges();
      const prefix = fixture.debugElement.query(By.css('.cds--header__name--prefix'));
      expect(prefix).toBeTruthy();
      expect(prefix.nativeElement.textContent.trim()).toBe('CarbideUI');
    });

    it('renders productName in the link', () => {
      host.productName = 'My App';
      detectChanges();
      expect(getLink().nativeElement.textContent).toContain('My App');
    });

    it('title attribute combines brand and productName', () => {
      host.brand = 'CarbideUI';
      host.productName = 'My App';
      detectChanges();
      expect(getLink().nativeElement.getAttribute('title')).toBe('CarbideUI My App');
    });

    it('title attribute uses only brand when productName is empty', () => {
      host.brand = 'CarbideUI';
      host.productName = '';
      detectChanges();
      expect(getLink().nativeElement.getAttribute('title')).toBe('CarbideUI');
    });

    it('does not render brand prefix span when brand is empty', () => {
      host.brand = '';
      detectChanges();
      const prefix = fixture.debugElement.query(By.css('.cds--header__name--prefix'));
      expect(prefix).toBeFalsy();
    });

    it('title attribute uses only productName when brand is empty', () => {
      host.brand = '';
      host.productName = 'Suite';
      detectChanges();
      expect(getLink().nativeElement.getAttribute('title')).toBe('Suite');
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
