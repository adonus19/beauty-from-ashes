import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Locale } from '../../core/locale';

/** Stories: patients' own words, shared with written permission. Samples are labeled until then. */
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
}
