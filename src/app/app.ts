import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Locale } from './core/locale';
import { SiteFooter } from './core/site-footer/site-footer';
import { SiteHeader } from './core/site-header/site-header';

@Component({
  selector: 'bfa-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly locale = inject(Locale);
  private readonly document = inject(DOCUMENT);

  /** The base href would turn "#main" into a link to the home page, so the skip link moves focus itself. */
  protected skipToMain(event: Event): void {
    const main = this.document.getElementById('main');
    if (main) {
      event.preventDefault();
      main.focus();
      main.scrollIntoView();
    }
  }
}
