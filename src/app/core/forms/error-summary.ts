import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ReadonlyFieldTree, ValidationError } from '@angular/forms/signals';

import { Locale } from '../locale';

/**
 * After a send attempt that fails, lists every answer that needs a change and takes focus, so
 * nobody has to hunt through a long form. Each entry moves focus to its control.
 */
@Component({
  selector: 'bfa-error-summary',
  template: `
    <div
      #box
      class="error-summary"
      tabindex="-1"
      role="group"
      aria-labelledby="error-summary-title"
    >
      <h2 id="error-summary-title" class="error-summary__title">{{ text().summaryTitle }}</h2>
      <p>{{ text().summaryIntro }}</p>
      <ul class="error-summary__list" role="list">
        @for (error of errors(); track $index) {
          <li>
            <button class="error-summary__link" type="button" (click)="focusField(error)">
              {{ error.message }}
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorSummary {
  readonly form = input.required<ReadonlyFieldTree<unknown>>();
  /** Bumped by the form on every failed send, so the summary takes focus each time. */
  readonly attempt = input.required<number>();

  private readonly document = inject(DOCUMENT);
  private readonly locale = inject(Locale);
  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');

  protected readonly text = computed(() => this.locale.content().site.forms);
  protected readonly errors = computed(() => {
    const seen = new Set<unknown>();
    return this.form()()
      .errorSummary()
      .filter((error) => !seen.has(error.fieldTree) && seen.add(error.fieldTree));
  });

  constructor() {
    afterRenderEffect(() => {
      this.attempt();
      this.box().nativeElement.focus();
    });
  }

  protected focusField(error: ValidationError.WithFieldTree): void {
    const name = error.fieldTree().name();
    const control = this.document.getElementsByName(name)[0];
    if (control) {
      control.focus();
      control.scrollIntoView({ block: 'center' });
    }
  }
}
