import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    page = fixture.nativeElement as HTMLElement;
  });

  it('leads with one h1 and both actions', () => {
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(page.querySelector('h1')?.textContent?.trim()).toBe(
      'Restoring more than what can be seen.',
    );
    expect(page.querySelector('.hero__actions .btn-brush')?.getAttribute('href')).toBe(
      '/ask-for-help',
    );
    expect(page.querySelector('.hero__actions .btn-line')?.getAttribute('href')).toBe('/refer');
  });

  it('sets the mission statement word for word above the values', () => {
    const mission = page.querySelector('.mission__quote')?.textContent?.replace(/\s+/g, ' ').trim();
    expect(mission).toBe(
      '“To glorify God by serving every patient with Christlike compassion and surgical excellence, fostering healing that reaches beyond the physical and opens the way for spiritual transformation.”',
    );
    const missionSection = page.querySelector('.mission')!;
    const valuesSection = page.querySelector('.values')!;
    expect(
      missionSection.compareDocumentPosition(valuesSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('lists the six core values in the card order', () => {
    const names = [...page.querySelectorAll('.value__name')].map((n) => n.textContent?.trim());
    expect(names).toEqual([
      'We Listen.',
      'We Protect.',
      'We Pray.',
      'We Accompany.',
      'We Honor.',
      'We Serve.',
    ]);
  });

  it('keeps five numbered steps in an ordered list, with the draft note outside it', () => {
    expect(page.querySelectorAll('ol.process__steps > li').length).toBe(5);
    expect(page.querySelector('ol.process__steps .process__draft')).toBeNull();
    expect(page.querySelector('.process__draft')).toBeTruthy();
  });

  it('labels the sample story as not a real patient', () => {
    expect(page.querySelector('.story__sample')?.textContent).toContain('not a real patient');
  });
});
