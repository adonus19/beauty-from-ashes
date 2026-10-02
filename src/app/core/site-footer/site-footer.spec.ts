import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

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

  it('labels the placeholder contact details as placeholders', async () => {
    const fixture = TestBed.createComponent(SiteFooter);
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.site-footer__note')?.textContent,
    ).toContain('placeholders');
  });
});
