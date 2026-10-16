import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccTag } from './ngcc-tag';

describe('NgccTag', () => {
  let fixture: ComponentFixture<NgccTag>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgccTag],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(NgccTag);
  });

  it('applies type and size classes', async () => {
    fixture.componentRef.setInput('type', 'green');
    fixture.componentRef.setInput('size', 'sm');
    await fixture.whenStable();
    const tag = el().querySelector('.cds--tag')!;
    expect(tag.classList).toContain('cds--tag--green');
    expect(tag.classList).toContain('cds--tag--sm');
  });

  it('renders a dot only when requested', async () => {
    await fixture.whenStable();
    expect(el().querySelector('.ngcc-tag__dot')).toBeNull();
    fixture.componentRef.setInput('dot', true);
    await fixture.whenStable();
    expect(el().querySelector('.ngcc-tag__dot')).not.toBeNull();
  });

  it('emits dismissed from the close button', async () => {
    fixture.componentRef.setInput('dismissible', true);
    await fixture.whenStable();
    let count = 0;
    fixture.componentInstance.dismissed.subscribe(() => count++);
    el().querySelector<HTMLButtonElement>('.cds--tag__close-icon')!.click();
    expect(count).toBe(1);
  });
});
