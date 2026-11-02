import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { localeWith } from '../testing/locale-stub';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteFooter],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('closes with the namesake verse and Soli Deo Gloria', async () => {
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();
    const footer = fixture.nativeElement as HTMLElement;

    expect(footer.querySelector('.site-footer__scripture figcaption')?.textContent).toContain(
      'Isaiah 61:3, NKJV',
    );
    expect(footer.querySelector('.site-footer__closing')?.textContent?.trim()).toBe(
      'Soli Deo Gloria',
    );
  });

  it('shows the phone and mailing address, and no email or placeholder note', async () => {
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();
    const footer = fixture.nativeElement as HTMLElement;

    expect(footer.querySelector('a[href="tel:+19802376958"]')?.textContent).toContain(
      '980-237-6958',
    );
    expect(footer.textContent).toContain('1366 Broadcloth Street, Suite 101');
    expect(footer.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(footer.querySelector('.site-footer__note')).toBeNull();
  });

  it('shows the email once one is set', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SiteFooter],
      providers: [provideRouter([]), localeWith({ email: 'hello@bfa.example' })],
    }).compileComponents();
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('a[href="mailto:hello@bfa.example"]'),
    ).not.toBeNull();
  });
});
