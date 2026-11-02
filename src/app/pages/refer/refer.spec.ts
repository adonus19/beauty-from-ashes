import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import en from '../../../content/en.json';
import { Refer } from './refer';

describe('Refer', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [Refer],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Refer);
    await fixture.whenStable();
    return fixture;
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
});
