import { DOCUMENT } from '@angular/common';
import { Service, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import en from '../../content/en.json';
import esOverlay from '../../content/es.json';

export type LocaleCode = 'en' | 'es';
export type SiteContent = typeof en;

const SPANISH_PREFIX = /^\/es(\/|$|\?|#)/;

/** Spanish falls back to English field by field until a translation exists. */
const es = mergeContent(en, esOverlay) as SiteContent;

@Service()
export class Locale {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  readonly code = computed<LocaleCode>(() => (SPANISH_PREFIX.test(this.url()) ? 'es' : 'en'));
  readonly content = computed(() => (this.code() === 'es' ? es : en));
  readonly translationPending = computed(() => this.code() === 'es' && esOverlay.translationPending);
  readonly pendingNotice = esOverlay.pendingNotice;

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.code();
    });
  }

  /** Builds a router link for a page path in the current language. */
  link(path = ''): string {
    const clean = path.replace(/^\/+/, '');
    return this.code() === 'es' ? `/es${clean ? `/${clean}` : ''}` : `/${clean}`;
  }

  /** The current page in the other language. */
  alternate(target: LocaleCode): string {
    const path = this.url().split(/[?#]/)[0].replace(SPANISH_PREFIX, '/');
    const clean = path.replace(/^\/+/, '');
    return target === 'es' ? `/es${clean ? `/${clean}` : ''}` : `/${clean}`;
  }
}

function mergeContent(base: unknown, overlay: unknown): unknown {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return overlay ?? base;
  }
  if (typeof overlay !== 'object' || overlay === null) {
    return base;
  }
  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(overlay)) {
    merged[key] = key in merged ? mergeContent(merged[key], value) : value;
  }
  return merged;
}
