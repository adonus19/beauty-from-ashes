import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

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

  it('lists every missing answer after an empty send, and asks for a photo', async () => {
    const fixture = await render();
    const page = fixture.nativeElement as HTMLElement;
    page.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await fixture.whenStable();
    const errors = [...page.querySelectorAll('.error-summary__link')].map((e) =>
      e.textContent?.trim(),
    );
    expect(errors).toContain('Add at least one photo.');
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
});
