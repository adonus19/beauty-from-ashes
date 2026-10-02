import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GetHelp } from './get-help';

describe('GetHelp', () => {
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetHelp],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(GetHelp);
    await fixture.whenStable();
    page = fixture.nativeElement as HTMLElement;
  });

  it('leads with one h1 and sends people to the request form', () => {
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(page.querySelector('.reference__aside .btn-brush')?.getAttribute('href')).toBe(
      '/ask-for-help',
    );
  });

  it('lists every section in the jump list, the first one current', () => {
    const links = [...page.querySelectorAll('.jump__link')];
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Who can ask',
      'What it costs',
      'What to have ready',
      'Your privacy',
      'Questions people ask',
    ]);
    expect(links[0].getAttribute('aria-current')).toBe('true');
    for (const link of links) {
      const id = link.getAttribute('href')?.split('#')[1] ?? '';
      expect(page.querySelector(`#${id}`)).toBeTruthy();
    }
  });

  it('marks guessed answers as placeholders', () => {
    expect(page.querySelectorAll('.placeholder-tag').length).toBeGreaterThan(3);
  });
});
