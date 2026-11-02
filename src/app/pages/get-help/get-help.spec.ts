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
      'Conditions we help with',
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

  it('names every condition in everyday and medical language', () => {
    const text = (page.textContent ?? '').replace(/\s+/g, ' ').toLowerCase();
    const terms = [
      'scar repair',
      'scar revision',
      'facial deformity',
      'reconstruction',
      'birth defect',
      'congenital',
      'cleft lip',
      'cleft-related surgery',
      'trauma',
      'burn scars',
      'skin lesions or growths that affect appearance or function',
      'breast reconstruction',
      'abdominal wall',
      'major weight loss',
      'revision after previous surgery',
      'children with congenital or acquired differences',
    ];
    for (const term of terms) {
      expect(text).toContain(term);
    }
  });

  it('puts the conditions in the jump list', () => {
    const links = [...page.querySelectorAll('.jump__link')].map((l) => l.textContent?.trim());
    expect(links).toContain('Conditions we help with');
  });

  it('works searchable phrases into the page', () => {
    const text = (page.textContent ?? '').replace(/\s+/g, ' ').toLowerCase();
    for (const phrase of [
      'charitable plastic surgery',
      'pro bono reconstructive surgery',
      'cannot afford plastic surgery',
      'reconstructive plastic surgeon',
    ]) {
      expect(text).toContain(phrase);
    }
  });
});
