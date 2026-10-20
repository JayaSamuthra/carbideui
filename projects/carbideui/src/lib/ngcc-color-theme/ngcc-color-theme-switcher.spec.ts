import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { NgccColorThemeSwitcher } from './ngcc-color-theme-switcher';
import { NgccColorThemeService } from './ngcc-color-theme.service';

@Component({
  standalone: true,
  imports: [NgccColorThemeSwitcher],
  template: `<ngcc-color-theme-switcher [defaultColor]="defaultColor" />`,
})
class TestHostComponent {
  defaultColor: string | undefined;
}

describe('NgccColorThemeSwitcher', () => {
  let fixture: ComponentFixture<NgccColorThemeSwitcher>;
  let component: NgccColorThemeSwitcher;
  let colorService: NgccColorThemeService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [NgccColorThemeSwitcher],
      providers: [provideZonelessChangeDetection(), NgccColorThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(NgccColorThemeSwitcher);
    component = fixture.componentInstance;
    colorService = TestBed.inject(NgccColorThemeService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update primary color signal when user selects a color', () => {
    const newColor = '#ff0000';
    const input = fixture.debugElement.query(By.css('input[type=color]')).nativeElement;
    input.value = newColor;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(colorService.primaryColor()).toBe(newColor);
  });

  it('should reset theme overrides when Reset button clicked', () => {
    const resetSpy = vi.spyOn(colorService, 'resetOverrides');

    const resetButton = fixture.debugElement.query(
      By.css('button.cds--btn.cds--btn--ghost'),
    ).nativeElement;
    resetButton.click();
    fixture.detectChanges();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('applies a typed hex value and flags an invalid one', () => {
    const hex = fixture.debugElement.query(By.css('#brand-color-hex')).nativeElement;
    hex.value = '#00ff00';
    hex.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(colorService.brandColor()).toBe('#00ff00');
    expect(fixture.debugElement.query(By.css('.ngcc--field-error'))).toBeNull();

    hex.value = '#12';
    hex.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(colorService.brandColor()).toBe('#00ff00');
    expect(fixture.debugElement.query(By.css('.ngcc--field-error'))).not.toBeNull();
  });

  it('applies a preset and marks it pressed', () => {
    const preset = fixture.debugElement.queryAll(By.css('.ngcc--preset'))[2];
    preset.nativeElement.click();
    fixture.detectChanges();
    expect(colorService.brandColor()).toBe('#8a3ffc');
    expect(preset.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('changes the WCAG level', () => {
    const select = fixture.debugElement.query(By.css('#wcag-level')).nativeElement;
    select.value = 'AAA';
    select.dispatchEvent(new Event('change'));
    expect(colorService.wcagConfig().level).toBe('AAA');
  });

  it('shows an accessibility status', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ngcc--report-status'))).not.toBeNull();
  });

  describe('categorized colors', () => {
    const rows = () => fixture.debugElement.queryAll(By.css('.ngcc--theme-colors__row'));
    const row = (label: string) =>
      rows().find((r) =>
        r.query(By.css('.ngcc--theme-colors__name')).nativeElement.textContent.includes(label),
      )!;
    const categoryTitles = (): string[] =>
      fixture.debugElement
        .queryAll(By.css('.ngcc--category__title'))
        .map((t) => t.nativeElement.textContent.trim());
    const filterBy = (value: string): void => {
      const input = fixture.debugElement.query(By.css('#ngcc-token-filter')).nativeElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };

    it('groups every customizable color into labelled sections', () => {
      expect(categoryTitles()).toEqual([
        'Brand',
        'Surfaces',
        'Text & icons',
        'Borders',
        'Status colors',
        'Links & focus',
        'Accessibility',
        'Result & export',
      ]);
      expect(rows().length).toBe(13);
    });

    it('lists status colors, including info, with their token names', () => {
      const info = row('Info');
      const tokens = info
        .queryAll(By.css('.ngcc--token'))
        .map((t) => t.nativeElement.textContent.trim());
      expect(tokens).toEqual(['--cds-support-info', '--cds-support-04']);
      expect(row('Error').nativeElement.textContent).toContain('--cds-text-error');
      expect(row('Link').nativeElement.textContent).toContain('--cds-link-primary');
      expect(row('Focus ring').nativeElement.textContent).toContain('--cds-focus');
      expect(row('Layer 01').nativeElement.textContent).toContain('--cds-field-01');
    });

    it('flags status, link and focus as auto-adjusted', () => {
      expect(row('Info').nativeElement.textContent).toContain('auto-adjusted');
      expect(row('Background').nativeElement.textContent).not.toContain('auto-adjusted');
    });

    it('shows the brand tokens', () => {
      const text = fixture.debugElement.query(
        By.css('[aria-label="Tokens driven by the brand color"]'),
      ).nativeElement.textContent;
      expect(text).toContain('--cds-button-primary');
      expect(text).toContain('--cds-interactive');
    });

    it('lists the active base theme colors', () => {
      expect(row('Background').query(By.css('input[type=color]')).nativeElement.value).toBe(
        '#ffffff',
      );
      colorService.setBaseTheme('g100');
      fixture.detectChanges();
      expect(row('Background').query(By.css('input[type=color]')).nativeElement.value).toBe(
        '#161616',
      );
    });

    it('applies a picked color live to the active theme only', () => {
      const picker = row('Background').query(By.css('input[type=color]')).nativeElement;
      picker.value = '#fafafa';
      picker.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(colorService.getThemeColor('white', 'background')).toBe('#fafafa');
      expect(colorService.getThemeColor('g10', 'background')).toBe('#f4f4f4');
      expect(row('Background').nativeElement.textContent).toContain('modified');
    });

    it('customizes the info color through the picker', () => {
      const picker = row('Info').query(By.css('input[type=color]')).nativeElement;
      picker.value = '#6600cc';
      picker.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(colorService.isThemeColorOverridden('white', 'support-info')).toBe(true);
      expect(colorService.infoColor()).toBe('#6600cc');
      expect(row('Info').nativeElement.textContent).toContain('modified');
    });

    it('commits a typed hex and reverts an invalid one', () => {
      const hex = row('Layer 01').query(By.css('input[type=text]')).nativeElement;
      hex.value = '#e8e8e8';
      hex.dispatchEvent(new Event('change'));
      expect(colorService.getThemeColor('white', 'layer-01')).toBe('#e8e8e8');

      hex.value = 'nope';
      hex.dispatchEvent(new Event('change'));
      expect(hex.value).toBe('#e8e8e8');
      expect(colorService.getThemeColor('white', 'layer-01')).toBe('#e8e8e8');
    });

    it('resets a single color and the whole theme', () => {
      colorService.setThemeColor('white', 'background', '#fafafa');
      colorService.setThemeColor('white', 'support-info', '#6600cc');
      fixture.detectChanges();

      row('Background').query(By.css('.ngcc--theme-colors__reset')).nativeElement.click();
      fixture.detectChanges();
      expect(colorService.isThemeColorOverridden('white', 'background')).toBe(false);
      expect(colorService.isThemeColorOverridden('white', 'support-info')).toBe(true);

      fixture.debugElement
        .query(By.css('.ngcc--theme-colors__header button'))
        .nativeElement.click();
      expect(colorService.isThemeColorOverridden('white', 'support-info')).toBe(false);
    });

    it('shows how many colors changed per category and overall', () => {
      colorService.setThemeColor('white', 'support-info', '#6600cc');
      colorService.setThemeColor('white', 'support-error', '#990000');
      colorService.setThemeColor('white', 'background', '#fafafa');
      fixture.detectChanges();

      const badges = fixture.debugElement
        .queryAll(By.css('.ngcc--category__badge'))
        .map((b) => b.nativeElement.textContent.trim());
      expect(badges).toContain('2 changed'); // status
      expect(badges).toContain('1 changed'); // surfaces
      expect(fixture.nativeElement.textContent).toContain('3 changed');
    });

    it('is hidden with showThemeColors=false', () => {
      fixture.componentRef.setInput('showThemeColors', false);
      fixture.detectChanges();
      expect(rows().length).toBe(0);
      expect(categoryTitles()).not.toContain('Surfaces');
    });

    describe('search', () => {
      it('finds a color by its token name and hides the other categories', () => {
        filterBy('--cds-support-info');
        expect(categoryTitles()).toEqual(['Status colors', 'Accessibility', 'Result & export']);
        expect(rows().length).toBe(1);
        expect(row('Info')).toBeDefined();
      });

      it('finds a color by name', () => {
        filterBy('focus');
        expect(
          rows()
            .map((r) => r.nativeElement.textContent)
            .join(),
        ).toContain('Focus ring');
        expect(categoryTitles()).toContain('Links & focus');
      });

      it('shows brand when searching a brand token', () => {
        filterBy('--cds-button-primary');
        expect(categoryTitles()).toContain('Brand');
      });

      it('expands matching categories', () => {
        filterBy('info');
        const status = fixture.debugElement
          .queryAll(By.css('details.ngcc--category'))
          .find((d) => d.nativeElement.textContent.includes('Status colors'))!;
        expect(status.nativeElement.open).toBe(true);
      });

      it('says when nothing matches', () => {
        filterBy('zzzz-nothing');
        expect(rows().length).toBe(0);
        expect(fixture.nativeElement.textContent).toContain('No colors or tokens match');
      });

      it('restores everything when cleared', () => {
        filterBy('info');
        filterBy('');
        expect(rows().length).toBe(13);
      });
    });

    describe('color theme chips', () => {
      const chips = () => fixture.debugElement.queryAll(By.css('.ngcc--chip'));

      it('offers Carbon plus the built-in color themes', () => {
        expect(chips().map((c) => c.nativeElement.textContent.trim())).toEqual([
          'Carbon',
          'Ocean',
          'Royal',
          'Ember',
        ]);
        expect(chips()[0].nativeElement.getAttribute('aria-pressed')).toBe('true');
      });

      it('applies a color theme and marks it pressed', () => {
        chips()[1].nativeElement.click();
        fixture.detectChanges();
        expect(colorService.brandColor()).toBe('#007d79');
        expect(colorService.getThemeColor('white', 'background')).toBe('#f8fbfb');
        expect(chips()[1].nativeElement.getAttribute('aria-pressed')).toBe('true');
        expect(chips()[0].nativeElement.getAttribute('aria-pressed')).toBe('false');
      });

      it('Carbon returns to the defaults', () => {
        chips()[2].nativeElement.click();
        chips()[0].nativeElement.click();
        fixture.detectChanges();
        expect(colorService.themeColorOverrides()).toEqual({});
        expect(colorService.brandColor()).toBe('#0f62fe');
        expect(chips()[0].nativeElement.getAttribute('aria-pressed')).toBe('true');
      });
    });

    describe('token names', () => {
      it('copies a token name to the clipboard on click', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

        const chip = row('Info').queryAll(By.css('.ngcc--token'))[0];
        chip.nativeElement.click();
        await fixture.whenStable();

        expect(writeText).toHaveBeenCalledWith('--cds-support-info');
      });
    });
  });

  describe('defaultColor input', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let service: NgccColorThemeService;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      service = TestBed.inject(NgccColorThemeService);
    });

    it('should set the brand color to the provided defaultColor', async () => {
      hostComponent.defaultColor = '#1e70cd';
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      expect(service.brandColor()).toBe('#1e70cd');
    });

    it('should reset to the custom default color instead of hardcoded fallback', async () => {
      hostComponent.defaultColor = '#1e70cd';
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      // Change to a different color
      service.updateBrandColor('#ff0000');
      expect(service.brandColor()).toBe('#ff0000');

      // Reset should go back to the custom default
      service.resetOverrides();
      expect(service.brandColor()).toBe('#1e70cd');
    });
  });
});
