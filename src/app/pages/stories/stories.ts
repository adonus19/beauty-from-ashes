import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Locale } from '../../core/locale';

/** One consented story. Content adds entries to `stories.items`; no code change is needed. */
export interface Story {
  id: string;
  quote: string;
  attribution: string;
  condition: string;
  body: readonly string[];
}

/** Stories: patients' own words, shared only with each person's written permission. */
@Component({
  selector: 'bfa-stories',
  imports: [RouterLink],
  templateUrl: './stories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-block' },
})
export class Stories {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().stories);
  protected readonly items = computed<readonly Story[]>(() => this.page().items);
}
