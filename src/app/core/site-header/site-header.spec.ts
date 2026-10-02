import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('lists the five main pages and the Give action', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const header = fixture.nativeElement as HTMLElement;

    const links = [...header.querySelectorAll('.site-nav__link')].map((a) => a.textContent?.trim());
    expect(links).toEqual(['Get Help', 'Volunteer', 'Partner', 'Stories', 'About']);
    expect(header.querySelector('.give')?.getAttribute('href')).toBe('/give');
  });

  it('opens and closes the menu, and closes it on Escape', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.menu-button',
    )!;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('marks the current language', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const current = (fixture.nativeElement as HTMLElement).querySelector(
      '.lang__link[aria-current="true"]',
    );
    expect(current?.getAttribute('lang')).toBe('en');
  });
});
