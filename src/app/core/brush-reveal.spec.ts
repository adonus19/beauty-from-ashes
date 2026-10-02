import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BrushReveal } from './brush-reveal';

@Component({
  imports: [BrushReveal],
  template: `<section bfaBrushReveal></section>`,
})
class Host {}

describe('BrushReveal', () => {
  it('leaves a section on screen painted rather than arming it', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const section = (fixture.nativeElement as HTMLElement).querySelector('section');

    expect(section?.classList.contains('is-armed')).toBe(false);
  });
});
