import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrushReveal } from '../brush-reveal';
import { Locale } from '../locale';

@Component({
  selector: 'bfa-site-footer',
  imports: [RouterLink, BrushReveal],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly locale = inject(Locale);
  protected readonly site = computed(() => this.locale.content().site);
}
