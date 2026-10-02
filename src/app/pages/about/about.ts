import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

/** About: the name, the mission card in full, and who leads and oversees the ministry. */
@Component({
  selector: 'bfa-about',
  imports: [RouterLink, PlaceholderTag],
  templateUrl: './about.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-block' },
})
export class About {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().about);
  protected readonly home = computed(() => this.locale.content().home);
  protected readonly site = computed(() => this.locale.content().site);
}
