import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  signal,
} from '@angular/core';
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
    '(document:keydown.escape)': 'onEscape()',
    '(keydown.tab)': 'onTab($any($event))',
    '(keydown.shift.tab)': 'onTab($any($event))',
  },
})
export class SiteHeader {
  protected readonly locale = inject(Locale);
  protected readonly site = computed(() => this.locale.content().site);
  protected readonly menuOpen = signal(false);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const subscription = inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.onNavigated());
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  // The panel is hidden once closed, so focus left inside it would be lost. Send it to the button.
  protected onEscape(): void {
    if (!this.menuOpen()) return;
    const root = this.host.nativeElement;
    const inPanel = root.querySelector('#site-menu')?.contains(this.document.activeElement);
    this.closeMenu();
    if (inPanel) root.querySelector<HTMLButtonElement>('.menu-button')?.focus();
  }

  // The panel sits before its button in the page, so the browser's own Tab order would skip it.
  // While it is open, Tab and Shift+Tab loop through Close, the links and the language switch.
  protected onTab(event: KeyboardEvent): void {
    if (!this.menuOpen()) return;
    const root = this.host.nativeElement;
    const button = root.querySelector<HTMLButtonElement>('.menu-button');
    if (!button || this.document.defaultView!.getComputedStyle(button).display === 'none') return;
    const stops = [
      button,
      ...root.querySelectorAll<HTMLElement>('#site-menu .site-nav__link, #site-menu .lang__link'),
    ];
    const at = stops.indexOf(this.document.activeElement as HTMLElement);
    if (at === -1) return;
    event.preventDefault();
    stops[(at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
  }

  // Following a menu link hides the panel and the link with it; hand focus to the page content
  // instead of letting it fall to the body.
  private onNavigated(): void {
    const inPanel = this.host.nativeElement
      .querySelector('#site-menu')
      ?.contains(this.document.activeElement);
    const wasOpen = this.menuOpen();
    this.closeMenu();
    if (wasOpen && inPanel) this.document.getElementById('main')?.focus({ preventScroll: true });
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
