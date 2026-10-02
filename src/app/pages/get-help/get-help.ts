import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { JumpNav, JumpTarget } from '../../core/jump-nav/jump-nav';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

/** Get Help: what someone asking for themselves or their child needs to know before they ask. */
@Component({
  selector: 'bfa-get-help',
  imports: [RouterLink, JumpNav, PlaceholderTag],
  templateUrl: './get-help.html',
  styleUrl: './get-help.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetHelp {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().getHelp);
  protected readonly contact = computed(() => this.locale.content().site.contact);
  protected readonly placeholderNote = computed(() => this.locale.content().site.placeholder.note);

  protected readonly sections = computed<JumpTarget[]>(() => {
    const page = this.page();
    return [page.who, page.cost, page.ready, page.privacy, page.questions].map(({ id, title }) => ({
      id,
      title,
    }));
  });
}
