import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { Locale } from '../locale';

@Component({
  selector: 'bfa-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class SiteHeader {
  protected readonly locale = inject(Locale);
  protected readonly site = computed(() => this.locale.content().site);
  protected readonly menuOpen = signal(false);

  constructor() {
    const subscription = inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
