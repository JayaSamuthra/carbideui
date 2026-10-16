import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NgccTile } from './ngcc-tile';

@Component({
  imports: [NgccTile],
  template: `
    <ngcc-tile
      heading="Title"
      [clickable]="clickable"
      [href]="href"
      (activated)="clicks = clicks + 1"
    >
      Body
      <button ngccTileAction>Act</button>
      <span ngccTileFooter>Foot</span>
    </ngcc-tile>
  `,
})
class Host {
  clickable = false;
  href: string | undefined;
  clicks = 0;
}

describe('NgccTile', () => {
  async function create(setup: (h: Host) => void = () => {}) {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    setup(fixture.componentInstance);
    await fixture.whenStable();
    return fixture;
  }

  it('projects heading, body, action and footer', async () => {
    const f = await create();
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelector('.ngcc-tile__heading')!.textContent).toBe('Title');
    expect(el.querySelector('.ngcc-tile__body')!.textContent).toContain('Body');
    expect(el.querySelector('.ngcc-tile__header button')).not.toBeNull();
    expect(el.querySelector('.ngcc-tile__footer')!.textContent).toContain('Foot');
  });

  it('renders a div by default', async () => {
    const f = await create();
    expect((f.nativeElement as HTMLElement).querySelector('div.cds--tile')).not.toBeNull();
  });

  it('renders a button and emits activated when clickable', async () => {
    const f = await create((h) => (h.clickable = true));
    (f.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button.cds--tile')!.click();
    expect(f.componentInstance.clicks).toBe(1);
  });

  it('renders an anchor with href', async () => {
    const f = await create((h) => (h.href = '/x'));
    expect(
      (f.nativeElement as HTMLElement).querySelector('a.cds--tile')!.getAttribute('href'),
    ).toBe('/x');
  });
});
