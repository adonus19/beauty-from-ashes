import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import en from '../../../content/en.json';
import { fakeSubmission } from '../../core/testing/fake-submission';
import { choose, settle, typeInto } from '../../core/testing/form-input';
import { AskForHelp } from './ask-for-help';

describe('AskForHelp', () => {
  async function render(live = false) {
    const { fake, provider } = fakeSubmission(live);
    await TestBed.configureTestingModule({
      imports: [AskForHelp],
      providers: [provideRouter([]), provider],
    }).compileComponents();
    const fixture = TestBed.createComponent(AskForHelp);
    await fixture.whenStable();
    return Object.assign(fixture, { fake });
  }

  it('says plainly that the demo form sends nothing', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    expect(page.querySelector('.demo-notice')?.textContent).toContain(
      'Nothing you enter here is sent or saved',
    );
  });

  it('hides the demo notice once a real service is connected', async () => {
    const page = (await render(true)).nativeElement as HTMLElement;
    expect(page.querySelector('.demo-notice')).toBeNull();
    expect(page.textContent).not.toContain('Nothing you enter here is sent or saved');
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

  async function fillValidRequest(fixture: Awaited<ReturnType<typeof render>>) {
    const page = fixture.nativeElement as HTMLElement;
    choose(page, 'input[type=radio][value=self]');
    typeInto(page, '#patient-first', 'Sam');
    typeInto(page, '#patient-last', 'Doe');
    typeInto(page, '#phone', '704-555-0100');
    choose(page, 'input[type=radio][value=call]');
    choose(page, '#safe-message input[value=yes]');
    typeInto(page, '#city', 'Fort Mill');
    typeInto(page, '#state', 'SC');
    typeInto(page, '#care-type', en.home.conditions.items[0].name);
    typeInto(page, '#description', 'A scar on my arm.');
    choose(page, '#consent-contact');
    choose(page, '#consent-authority');
    await fixture.whenStable();
  }

  async function press(fixture: Awaited<ReturnType<typeof render>>, selector: string) {
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(selector)!.click();
    await fixture.whenStable();
  }

  const submitButton = 'button[type=submit]';
  const live = (page: HTMLElement) => page.querySelector('[role=status]')?.textContent?.trim();

  describe('sending', () => {
    it('with no service connected, shows the demo confirmation and sends nothing real', async () => {
      const fixture = await render(false);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidRequest(fixture);
      await press(fixture, submitButton);

      expect(page.querySelector('.error-summary')).toBeNull();
      expect(page.querySelector('.form-sent__title')?.textContent).toContain('ready');
      expect(page.querySelector('.form-sent__demo')?.textContent).toContain('nothing was sent');
    });

    it('with a service connected, hands over only the kept answers and then confirms', async () => {
      const fixture = await render(true);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidRequest(fixture);
      await press(fixture, submitButton);

      expect(fixture.fake.calls).toHaveLength(1);
      expect(fixture.fake.calls[0].kind).toBe('request');
      expect(fixture.fake.calls[0].answers).toMatchObject({
        patientFirst: 'Sam',
        patientLast: 'Doe',
        description: 'A scar on my arm.',
        consentContact: true,
      });

      fixture.fake.succeed();
      await settle(fixture);
      expect(page.querySelector('.form-sent__title')?.textContent).toContain('We received');
      expect(page.querySelector('.form-sent__demo')).toBeNull();
      expect(document.activeElement).toBe(page.querySelector('.form-sent__title'));
      expect(live(page)).toBe(en.askForHelp.sent.announce);
    });

    it('announces the wait, and ignores a second press while it is sending', async () => {
      const fixture = await render(true);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidRequest(fixture);
      await press(fixture, submitButton);

      expect(live(page)).toBe(en.site.forms.sending);
      const button = page.querySelector<HTMLButtonElement>(submitButton)!;
      expect(button.getAttribute('aria-disabled')).toBe('true');
      await press(fixture, submitButton);
      page.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await fixture.whenStable();
      expect(fixture.fake.calls).toHaveLength(1);
    });

    it('keeps the answers, announces the problem and offers a retry that takes focus', async () => {
      const fixture = await render(true);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidRequest(fixture);
      await press(fixture, submitButton);
      fixture.fake.fail('server');
      await settle(fixture);

      expect(page.querySelector<HTMLInputElement>('#patient-first')!.value).toBe('Sam');
      expect(page.querySelector('.form-sent')).toBeNull();
      expect(live(page)).toContain(en.site.forms.failed);
      expect(page.textContent).toContain(en.site.contact.phone);
      const retry = page.querySelector<HTMLButtonElement>('.submit-status__retry')!;
      expect(retry.textContent?.trim()).toBe(en.site.forms.retry);
      expect(document.activeElement).toBe(retry);

      retry.click();
      await fixture.whenStable();
      expect(fixture.fake.calls).toHaveLength(2);
      expect(document.activeElement).toBe(page.querySelector('.submit-status'));
      expect(live(page)).toBe(en.site.forms.sending);
      expect(page.querySelector('.submit-status__retry')).toBeNull();

      fixture.fake.succeed();
      await settle(fixture);
      expect(page.querySelector('.form-sent__title')).toBeTruthy();
    });

    it('does not put anything the visitor typed in the console or storage', async () => {
      const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) =>
        vi.spyOn(console, m),
      );
      const fixture = await render(true);
      await fillValidRequest(fixture);
      await press(fixture, submitButton);
      fixture.fake.fail();
      await settle(fixture);

      spies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
      expect(JSON.stringify({ ...localStorage, ...sessionStorage })).not.toContain('Sam');
      expect(location.href).not.toContain('Sam');
    });
  });
});
