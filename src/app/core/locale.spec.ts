import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { Locale } from './locale';

@Component({ template: '' })
class Blank {}

describe('Locale', () => {
  let locale: Locale;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'es',
            children: [
              { path: '', component: Blank },
              { path: 'stories', component: Blank },
            ],
          },
          { path: '', component: Blank },
          { path: 'stories', component: Blank },
        ]),
      ],
    });
    locale = TestBed.inject(Locale);
    router = TestBed.inject(Router);
  });

  it('defaults to English links and content', () => {
    expect(locale.code()).toBe('en');
    expect(locale.link('stories')).toBe('/stories');
    expect(locale.link()).toBe('/');
    expect(locale.translationPending()).toBe(false);
  });

  it('switches to Spanish under /es and falls back to English copy', async () => {
    await router.navigateByUrl('/es/stories');

    expect(locale.code()).toBe('es');
    expect(locale.link('stories')).toBe('/es/stories');
    expect(locale.translationPending()).toBe(true);
    expect(locale.content().site.language.label).toBe('Idioma');
    expect(locale.content().home.hero.title).toBe('Restoring more than what can be seen.');
  });

  it('maps the current page to the other language', async () => {
    await router.navigateByUrl('/stories');
    expect(locale.alternate('es')).toBe('/es/stories');

    await router.navigateByUrl('/es/stories');
    expect(locale.alternate('en')).toBe('/stories');
  });

  it('keeps the mission statement verbatim across its display lines', () => {
    const mission = locale.content().home.mission;
    expect(mission.lines.join(' ')).toBe(mission.text);
  });
});
