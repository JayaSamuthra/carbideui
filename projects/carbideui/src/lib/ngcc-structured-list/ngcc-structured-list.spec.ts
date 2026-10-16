import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccStructuredList } from './ngcc-structured-list';

describe('NgccStructuredList', () => {
  it('renders headers and cells by column key', async () => {
    await TestBed.configureTestingModule({
      imports: [NgccStructuredList],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    const fixture: ComponentFixture<NgccStructuredList> =
      TestBed.createComponent(NgccStructuredList);
    fixture.componentRef.setInput('columns', [
      { key: 'name', header: 'Name' },
      { key: 'size', header: 'Size' },
    ]);
    fixture.componentRef.setInput('rows', [{ id: 1, name: 'vm-1', size: 4 }]);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.cds--structured-list-th').length).toBe(2);
    const cells = el.querySelectorAll('.cds--structured-list-td');
    expect(cells[0].textContent).toContain('vm-1');
    expect(cells[1].textContent).toContain('4');
  });
});
