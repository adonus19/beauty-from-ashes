import { Directive, ElementRef, computed, inject, input } from '@angular/core';
import { ReadonlyFieldTree } from '@angular/forms/signals';

/** An answer shows its error once the visitor has left the field or tried to send the form. */
export function errorShown(field: ReadonlyFieldTree<unknown>): boolean {
  const state = field();
  return state.touched() && state.invalid();
}

/**
 * Connects a control to its hint and error so screen readers announce them with the label.
 * Radio buttons pass the group's id, since the group owns the hint and the error.
 */
@Directive({
  selector: '[bfaField]',
  host: {
    '[attr.aria-invalid]': "shown() ? 'true' : null",
    '[attr.aria-describedby]': 'describedBy()',
  },
})
export class FormFieldA11y {
  readonly bfaField = input.required<ReadonlyFieldTree<unknown>>();
  readonly hasHint = input(false);
  readonly describeId = input('');

  private readonly ownId = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.id;

  protected readonly shown = computed(() => errorShown(this.bfaField()));
  protected readonly describedBy = computed(() => {
    const base = this.describeId() || this.ownId;
    const ids = [this.hasHint() ? `${base}-hint` : '', this.shown() ? `${base}-error` : ''];
    return ids.filter(Boolean).join(' ') || null;
  });
}
