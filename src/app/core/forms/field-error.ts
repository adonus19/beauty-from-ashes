import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ReadonlyFieldTree } from '@angular/forms/signals';

import { Locale } from '../locale';
import { errorShown } from './form-field-a11y';

/** The message under a control that needs a change, named for the control so it can describe it. */
@Component({
  selector: 'bfa-field-error',
  template: `
    @if (shown()) {
      <p class="field__error" [id]="for() + '-error'">
        <span class="visually-hidden">{{ prefix() }}</span> {{ message() }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldError {
  readonly field = input.required<ReadonlyFieldTree<unknown>>();
  readonly for = input.required<string>();

  private readonly locale = inject(Locale);
  protected readonly prefix = computed(() => this.locale.content().site.forms.errorPrefix);
  protected readonly shown = computed(() => errorShown(this.field()));
  protected readonly message = computed(() => this.field()().errors()[0]?.message ?? '');
}
