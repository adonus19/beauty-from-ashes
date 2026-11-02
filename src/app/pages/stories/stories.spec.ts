import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import en from '../../../content/en.json';
import { Stories } from './stories';

/** Every string value in a content branch, however deeply it is nested. */
function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

describe('Stories', () => {
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stories],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Stories);
    await fixture.whenStable();
    page = fixture.nativeElement as HTMLElement;
  });

  it('shows the empty state with no story articles while none is consented', () => {
    expect(page.querySelectorAll('article.tale').length).toBe(0);
    const empty = page.querySelector('.stories-empty');
    expect(empty).toBeTruthy();
    expect(empty?.textContent).toContain('written permission');
    expect(empty?.textContent).toContain('no photos');
  });

  it('keeps the share call to action after the empty state', () => {
    expect(page.querySelector('.closing .btn-brush')?.getAttribute('href')).toBe('/contact');
  });

  it('ships no sample text in the stories or home content', () => {
    const strings = [...collectStrings(en.stories), ...collectStrings(en.home)];
    expect(strings.filter((s) => /sample/i.test(s))).toEqual([]);
  });
});
