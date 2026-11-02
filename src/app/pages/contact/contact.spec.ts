import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { localeWith } from '../../core/testing/locale-stub';
import { Contact } from './contact';

describe('Contact', () => {
  async function render(...extra: object[]) {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [provideRouter([]), ...extra],
    }).compileComponents();
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the phone and mailing address with no email row', async () => {
    const page = await render();
    const details = page.querySelector('.contact__details') as HTMLElement;

    expect(details.querySelector('a[href="tel:+19802376958"]')?.textContent).toContain(
      '980-237-6958',
    );
    expect(details.textContent).toContain(
      'Beauty From Ashes Surgical Ministry, c/o WDF Aesthetic Plastic Surgery, 1366 Broadcloth Street, Suite 101, Fort Mill, SC 29715',
    );
    expect(details.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(details.textContent).not.toContain('Email');
  });

  it('links the address to a map in the same tab', async () => {
    const page = await render();
    const link = page.querySelector('.contact__details address a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(link.getAttribute('href')).not.toContain('WDF');
    expect(link.textContent).toContain('1366 Broadcloth Street, Suite 101');
    expect(link.getAttribute('target')).toBeNull();
  });

  it('shows the email row once an address is set', async () => {
    const page = await render(localeWith({ email: 'hello@bfa.example' }));
    expect(page.querySelector('a[href="mailto:hello@bfa.example"]')).not.toBeNull();
  });

  it('uses a neutral phone example in the form', async () => {
    const page = await render();
    expect(page.textContent).not.toContain('555');
  });
});
