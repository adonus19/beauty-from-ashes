import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrushReveal } from '../../core/brush-reveal';
import { Locale } from '../../core/locale';

@Component({
  selector: 'bfa-home',
  imports: [RouterLink, BrushReveal],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly locale = inject(Locale);
  protected readonly home = computed(() => this.locale.content().home);
}
