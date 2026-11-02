import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { localeWith } from '../../core/testing/locale-stub';
import { DocumentPage } from './document-page';

describe('DocumentPage', () => {
  async function render(content: 'privacy' | 'accessibility', ...extra: object[]) {
    await TestBed.configureTestingModule({
      imports: [DocumentPage],
      providers: [
        provideRouter([]),
        ...extra,
        { provide: ActivatedRoute, useValue: { snapshot: { data: { content } } } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(DocumentPage);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the privacy notice as a labeled draft', async () => {
    const page = await render('privacy');
    expect(page.querySelector('h1')?.textContent?.trim()).toBe('Privacy notice');
    expect(page.querySelector('.document__draft')?.textContent).toContain('draft');
  });

  it('shows the accessibility statement without a draft banner', async () => {
    const page = await render('accessibility');
    expect(page.querySelector('h1')?.textContent?.trim()).toBe('Accessibility');
    expect(page.querySelector('.document__draft')).toBeNull();
  });

  it('shows the phone and no mailto while no email is set', async () => {
    const page = await render('privacy');
    expect(page.querySelector('a[href="tel:+19802376958"]')).not.toBeNull();
    expect(page.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  it('shows the email once set', async () => {
    const page = await render('privacy', localeWith({ email: 'hello@bfa.example' }));
    expect(page.querySelector('a[href="mailto:hello@bfa.example"]')).not.toBeNull();
  });
});
