import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';

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

  constructor() {
    // Following a link that the new page replaces leaves focus on the body, and the next Tab would
    // start from the top of the page. After any page change except the first, hand it to main.
    const subscription = inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
      )
      .subscribe(() => {
        const active = this.document.activeElement;
        if (!active || active === this.document.body) {
          this.document.getElementById('main')?.focus({ preventScroll: true });
        }
      });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

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
