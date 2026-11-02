import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter([{ path: '**', children: [] }])],
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

  it('returns focus to the menu button when Escape closes the menu from inside the panel', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const header = fixture.nativeElement as HTMLElement;
    const button = header.querySelector<HTMLButtonElement>('.menu-button')!;

    button.click();
    await fixture.whenStable();
    header.querySelector<HTMLAnchorElement>('.site-nav__link')!.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  describe('keyboard with the menu open', () => {
    async function openMenu() {
      const fixture = TestBed.createComponent(SiteHeader);
      await fixture.whenStable();
      const header = fixture.nativeElement as HTMLElement;
      const button = header.querySelector<HTMLButtonElement>('.menu-button')!;
      button.click();
      await fixture.whenStable();
      const stops = [...header.querySelectorAll<HTMLElement>('.site-nav__link, .lang__link')];
      const tab = (shiftKey = false) => {
        const event = new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey,
          bubbles: true,
          cancelable: true,
        });
        (document.activeElement ?? document.body).dispatchEvent(event);
        return event;
      };
      return { fixture, header, button, stops, tab };
    }

    it('walks Tab from Close through every menu link and the language switch, then wraps', async () => {
      const { header, button, stops, tab } = await openMenu();
      button.focus();
      const visited: Element[] = [];
      for (let i = 0; i < stops.length + 1; i++) {
        const event = tab();
        expect(event.defaultPrevented).toBe(true);
        visited.push(document.activeElement!);
      }
      expect(visited).toEqual([...stops, button]);
    });

    it('walks Shift+Tab backwards and wraps from Close to the last stop', async () => {
      const { button, stops, tab } = await openMenu();
      button.focus();
      tab(true);
      expect(document.activeElement).toBe(stops[stops.length - 1]);
      stops[0].focus();
      tab(true);
      expect(document.activeElement).toBe(button);
    });

    it('does not trap Tab while the menu is closed', async () => {
      const fixture = TestBed.createComponent(SiteHeader);
      await fixture.whenStable();
      const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
        '.menu-button',
      )!;
      button.focus();
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      button.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('moves focus to the page content when a menu link navigates, so it is not lost to the body', async () => {
      const main = document.createElement('main');
      main.id = 'main';
      main.tabIndex = -1;
      document.body.appendChild(main);
      const { fixture, header, stops } = await openMenu();
      stops[0].focus();
      TestBed.inject(Router).navigateByUrl('/get-help');
      await fixture.whenStable();
      expect(header.querySelector('.menu-button')?.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(main);
      main.remove();
    });
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
