import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { JumpNav, JumpTarget } from '../../core/jump-nav/jump-nav';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

interface Line {
  readonly text: string;
  readonly placeholder: boolean;
}

interface DocumentSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly Line[];
  readonly items: readonly Line[];
}

/** Privacy and Accessibility: a plain reference document with an "On this page" list. */
@Component({
  selector: 'bfa-document-page',
  imports: [JumpNav, PlaceholderTag],
  templateUrl: './document-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-block' },
})
export class DocumentPage {
  private readonly locale = inject(Locale);
  private readonly key = inject(ActivatedRoute).snapshot.data['content'] as 'privacy' | 'accessibility';

  protected readonly doc = computed(() => {
    const content = this.locale.content();
    if (this.key === 'privacy') {
      const page = content.privacy;
      return {
        ...page,
        updatedPlaceholder: true,
        sections: page.sections.map((section) => ({ ...section, items: [] as Line[] })),
      };
    }
    return { ...content.accessibility, draft: '' };
  });

  protected readonly sections = computed<readonly DocumentSection[]>(() => this.doc().sections);
  protected readonly targets = computed<JumpTarget[]>(() =>
    this.sections().map(({ id, title }) => ({ id, title })),
  );
  protected readonly contact = computed(() => this.locale.content().site.contact);
}
