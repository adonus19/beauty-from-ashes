import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([{ path: '**', children: [] }])],
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

  it('moves focus to main after a page change that left it on the body, but not on first load', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    document.body.appendChild(fixture.nativeElement);
    const main = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('main#main')!;

    await router.navigateByUrl('/one');
    await fixture.whenStable();
    expect(document.activeElement).not.toBe(main);

    (document.activeElement as HTMLElement | null)?.blur();
    await router.navigateByUrl('/two');
    await fixture.whenStable();
    expect(document.activeElement).toBe(main);
    fixture.nativeElement.remove();
  });

  it('leaves focus alone when it is already on a control after a page change', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    document.body.appendChild(fixture.nativeElement);
    await router.navigateByUrl('/one');
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('a.skip-link')!;
    link.focus();
    await router.navigateByUrl('/two');
    await fixture.whenStable();
    expect(document.activeElement).toBe(link);
    fixture.nativeElement.remove();
  });
});
