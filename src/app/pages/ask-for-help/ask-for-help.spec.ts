import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import en from '../../../content/en.json';
import { AskForHelp } from './ask-for-help';

describe('AskForHelp', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [AskForHelp],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(AskForHelp);
    await fixture.whenStable();
    return fixture;
  }

  it('says plainly that the demo form sends nothing', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    expect(page.querySelector('.demo-notice')?.textContent).toContain(
      'Nothing you enter here is sent or saved',
    );
  });

  it('lists every missing answer after an empty send, and never asks for a photo', async () => {
    const fixture = await render();
    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();
    const errors = [...page.querySelectorAll('.error-summary__link')].map((e) =>
      e.textContent?.trim(),
    );
    expect(errors).not.toContain('Add at least one photo.');
    expect(errors).toContain('Enter the patient’s first name.');
    expect(page.querySelector('#patient-first')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('asks for the parent or guardian only when the request is for a child', async () => {
    const fixture = await render();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('#guardian-first')).toBeNull();
    const child = page.querySelector<HTMLInputElement>('input[type=radio][value=child]')!;
    child.click();
    await fixture.whenStable();
    expect(page.querySelector('#guardian-first')).toBeTruthy();
  });

  it('has no photo upload and none of the removed questions', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    expect(page.querySelector('input[type=file]')).toBeNull();
    for (const id of [
      'patient-birth',
      'daily-life',
      'how-long',
      'insurance',
      'heard-from',
      'notes',
    ]) {
      expect(page.querySelector(`#${id}`)).toBeNull();
    }
  });

  it('tells people photos and records come later, securely, if we move forward', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    expect(page.querySelector('.form__later')?.textContent).toMatch(
      /photos[\s\S]*records[\s\S]*if we move forward[\s\S]*later[\s\S]*secure/i,
    );
  });

  it('offers the conditions list plus Other / not sure as care types', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    const labels = [...page.querySelectorAll<HTMLOptionElement>('#care-type option')]
      .map((o) => o.textContent?.trim())
      .filter((label) => label !== 'Choose one');
    expect(labels).toEqual([...en.home.conditions.items.map((c) => c.name), 'Other / not sure']);
    expect(labels.length).toBe(13);
  });

  it('sends with only the kept answers', async () => {
    const fixture = await render();
    const page = fixture.nativeElement as HTMLElement;
    const type = (selector: string, value: string) => {
      const el = page.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        selector,
      )!;
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const choose = (selector: string) => page.querySelector<HTMLInputElement>(selector)!.click();

    choose('input[type=radio][value=self]');
    type('#patient-first', 'Sam');
    type('#patient-last', 'Doe');
    type('#phone', '704-555-0100');
    choose('input[type=radio][value=call]');
    choose('#safe-message input[value=yes]');
    type('#city', 'Fort Mill');
    type('#state', 'SC');
    type('#care-type', en.home.conditions.items[0].name);
    type('#description', 'A scar on my arm.');
    choose('#consent-contact');
    choose('#consent-authority');
    await fixture.whenStable();
    page.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();

    expect(page.querySelector('.error-summary')).toBeNull();
    expect(page.querySelector('.form-sent__title')).toBeTruthy();
  });
});
