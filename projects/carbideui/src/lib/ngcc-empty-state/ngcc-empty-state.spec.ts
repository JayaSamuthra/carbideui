import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Component } from '@angular/core';
import { NgccEmptyState } from './ngcc-empty-state';

@Component({
  standalone: true,
  imports: [NgccEmptyState],
  template: `<ngcc-empty-state title="No data" description="Nothing here" icon="search">
    <button ngccEmptyAction class="act">Create</button>
  </ngcc-empty-state>`,
})
class Host {}

describe('NgccEmptyState', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('renders title, description and icon', () => {
    expect(el().querySelector('h3')!.textContent).toContain('No data');
    expect(el().querySelector('.ngcc-empty__description')!.textContent).toContain('Nothing here');
    expect(el().querySelector('ngcc-icon')).not.toBeNull();
  });

  it('projects the action', () => {
    expect(el().querySelector('.ngcc-empty__action .act')).not.toBeNull();
  });
});
