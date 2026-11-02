import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import en from '../../../content/en.json';
import { fakeSubmission } from '../../core/testing/fake-submission';
import { choose, settle, typeInto } from '../../core/testing/form-input';
import { Refer } from './refer';

describe('Refer', () => {
  async function render(live = false) {
    const { fake, provider } = fakeSubmission(live);
    await TestBed.configureTestingModule({
      imports: [Refer],
      providers: [provideRouter([]), provider],
    }).compileComponents();
    const fixture = TestBed.createComponent(Refer);
    await fixture.whenStable();
    return Object.assign(fixture, { fake });
  }

  it('has no photo upload', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    expect(page.querySelector('input[type=file]')).toBeNull();
  });

  it('tells people photos and records come later, securely, if we move forward', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    expect(page.querySelector('.form__later')?.textContent).toMatch(
      /photos[\s\S]*records[\s\S]*if we move forward[\s\S]*later[\s\S]*secure/i,
    );
  });

  it('offers the same care types as the request form: the conditions plus Other / not sure', async () => {
    const page = (await render()).nativeElement as HTMLElement;
    const labels = [...page.querySelectorAll<HTMLOptionElement>('#care-type option')]
      .map((o) => o.textContent?.trim())
      .filter((label) => label !== 'Choose one');
    expect(labels).toEqual([...en.home.conditions.items.map((c) => c.name), 'Other / not sure']);
    expect(labels.length).toBe(13);
  });

  it('asks for the guardian only when the person is a child', async () => {
    const fixture = await render();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('#guardian-name')).toBeNull();
    page.querySelector<HTMLInputElement>('input[type=radio][value=child]')!.click();
    await fixture.whenStable();
    expect(page.querySelector('#guardian-name')).toBeTruthy();
  });

  async function fillValidReferral(fixture: Awaited<ReturnType<typeof render>>) {
    const page = fixture.nativeElement as HTMLElement;
    typeInto(page, '#your-first', 'Pat');
    typeInto(page, '#your-last', 'Lee');
    typeInto(page, '#role', 'pastor');
    typeInto(page, '#your-email', 'pat@example.org');
    typeInto(page, '#person-first', 'Sam');
    typeInto(page, '#person-last', 'Doe');
    choose(page, '#age input[value=adult]');
    typeInto(page, '#person-phone', '704-555-0100');
    typeInto(page, '#city', 'Fort Mill');
    typeInto(page, '#state', 'SC');
    typeInto(page, '#care-type', en.home.conditions.items[0].name);
    typeInto(page, '#need', 'A scar on their arm.');
    choose(page, '#consent');
    await fixture.whenStable();
  }

  const submitButton = 'form button[type=submit]';
  const live = (page: HTMLElement) => page.querySelector('[role=status]')?.textContent?.trim();

  async function press(fixture: Awaited<ReturnType<typeof render>>, selector: string) {
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(selector)!.click();
    await fixture.whenStable();
  }

  it('shows the demo notice with no service connected, and hides it once one is', async () => {
    const demo = (await render(false)).nativeElement as HTMLElement;
    expect(demo.querySelector('.demo-notice')?.textContent).toContain(
      'Nothing you enter here is sent or saved',
    );
    TestBed.resetTestingModule();
    const real = (await render(true)).nativeElement as HTMLElement;
    expect(real.querySelector('.demo-notice')).toBeNull();
  });

  describe('sending', () => {
    it('with no service connected, shows the demo confirmation', async () => {
      const fixture = await render(false);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidReferral(fixture);
      await press(fixture, submitButton);
      await settle(fixture);
      expect(page.querySelector('.form-sent__title')?.textContent).toContain('thinking of them');
      expect(page.querySelector('.form-sent__demo')?.textContent).toContain('nothing was sent');
    });

    it('with a service connected, hands over the answers, announces the wait and confirms', async () => {
      const fixture = await render(true);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidReferral(fixture);
      await press(fixture, submitButton);

      expect(fixture.fake.calls).toHaveLength(1);
      expect(fixture.fake.calls[0].kind).toBe('referral');
      expect(fixture.fake.calls[0].answers).toMatchObject({ yourFirst: 'Pat', personFirst: 'Sam' });
      expect(live(page)).toBe(en.site.forms.sending);
      expect(page.querySelector(submitButton)!.getAttribute('aria-disabled')).toBe('true');
      await press(fixture, submitButton);
      expect(fixture.fake.calls).toHaveLength(1);

      fixture.fake.succeed();
      await settle(fixture);
      expect(page.querySelector('.form-sent__title')?.textContent).toContain('We received');
      expect(page.querySelector('.form-sent__demo')).toBeNull();
      expect(document.activeElement).toBe(page.querySelector('.form-sent__title'));
      expect(live(page)).toBe(en.refer.sent.announce);
    });

    it('keeps the answers after a failure, announces it, and retries from the focused button', async () => {
      const fixture = await render(true);
      const page = fixture.nativeElement as HTMLElement;
      await fillValidReferral(fixture);
      await press(fixture, submitButton);
      fixture.fake.fail();
      await settle(fixture);

      expect(page.querySelector<HTMLInputElement>('#person-first')!.value).toBe('Sam');
      expect(live(page)).toContain(en.site.forms.failed);
      const retry = page.querySelector<HTMLButtonElement>('.submit-status__retry')!;
      expect(document.activeElement).toBe(retry);

      retry.click();
      await fixture.whenStable();
      expect(fixture.fake.calls).toHaveLength(2);
      expect(document.activeElement).toBe(page.querySelector('.submit-status'));
      fixture.fake.succeed();
      await settle(fixture);
      expect(page.querySelector('.form-sent__title')).toBeTruthy();
    });
  });
});
