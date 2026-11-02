import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { localeWith } from '../../core/testing/locale-stub';
import { About } from './about';

describe('About', () => {
  async function render(...extra: object[]) {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter([]), ...extra],
    }).compileComponents();
    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('lists the board by name only', async () => {
    const page = await render();
    const board = page.querySelector('[aria-labelledby="board-title"]') as HTMLElement;
    const names = Array.from(board.querySelectorAll('.board__name')).map((n) =>
      n.textContent?.trim(),
    );

    expect(names).toEqual(['Dr. W. Dale Franks, Jr.', 'Jessica Kennedy', 'Jay Kennedy']);
    expect(board.querySelector('.placeholder-tag')).toBeNull();
  });

  it('describes volunteers in general terms, with a heading', async () => {
    const page = await render();
    const group = page.querySelector('[aria-labelledby="volunteers-title"]') as HTMLElement;
    expect(group.querySelector('h2')?.textContent).toContain('Volunteers');
    expect(group.querySelector('.board__name')).toBeNull();
  });

  it('hides the EIN line until one is set', async () => {
    expect((await render()).textContent).not.toContain('EIN');
  });

  it('shows the EIN once set', async () => {
    const page = await render(localeWith({ ein: '12-3456789' }));
    expect(page.textContent).toContain('EIN: 12-3456789');
  });
});
