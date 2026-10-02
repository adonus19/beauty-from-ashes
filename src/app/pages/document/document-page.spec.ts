import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { DocumentPage } from './document-page';

describe('DocumentPage', () => {
  async function render(content: 'privacy' | 'accessibility') {
    await TestBed.configureTestingModule({
      imports: [DocumentPage],
      providers: [
        provideRouter([]),
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
});
