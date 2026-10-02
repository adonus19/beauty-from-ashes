import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { Locale } from '../locale';

/**
 * Marks a fact the ministry has not confirmed yet. Every guessed detail on the site carries one
 * until the real answer replaces it.
 */
@Component({
  selector: 'bfa-placeholder-tag',
  template: `<span class="placeholder-tag">{{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'placeholder-tag-host' },
})
export class PlaceholderTag {
  private readonly locale = inject(Locale);
  protected readonly label = computed(() => this.locale.content().site.placeholder.label);
}
