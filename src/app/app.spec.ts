import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the skip link, header, main landmark and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main');
    expect(page.querySelector('bfa-site-header header')).toBeTruthy();
    expect(page.querySelector('main#main')).toBeTruthy();
    expect(page.querySelector('bfa-site-footer footer')).toBeTruthy();
  });

  it('shows no translation notice on English pages', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.translation-notice')).toBeNull();
  });
});
