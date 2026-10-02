import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormField, email, form, pattern, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { ErrorSummary } from '../../core/forms/error-summary';
import { FieldError } from '../../core/forms/field-error';
import { FormFieldA11y } from '../../core/forms/form-field-a11y';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

/** Partner: ways for churches, businesses and organizations to take part, with a partner form. */
@Component({
  selector: 'bfa-partner',
  imports: [RouterLink, FormField, FormFieldA11y, FieldError, ErrorSummary, PlaceholderTag],
  templateUrl: './partner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-block' },
})
export class Partner {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().partner);
  protected readonly forms = computed(() => this.locale.content().site.forms);
  protected readonly placeholderNote = computed(() => this.locale.content().site.placeholder.note);

  private readonly blank = {
    first: '',
    last: '',
    organization: '',
    type: '',
    email: '',
    phone: '',
    referring: false,
    prayer: false,
    volunteers: false,
    giving: false,
    speaking: false,
    inKind: false,
    message: '',
  };

  protected readonly model = signal({ ...this.blank });

  private readonly errors = this.locale.content().partner.errors;

  protected readonly partnerForm = form(this.model, (s) => {
    const e = this.errors;
    required(s.first, { message: e.first });
    required(s.last, { message: e.last });
    required(s.organization, { message: e.organization });
    required(s.type, { message: e.type });
    required(s.email, { message: e.email });
    email(s.email, { message: e.email });
    pattern(s.phone, /^\D*(\d\D*){10,11}$/, { message: e.phone });
  });

  protected readonly attempts = signal(0);
  protected readonly sent = signal(false);

  private readonly sentHeading = viewChild<ElementRef<HTMLElement>>('sentHeading');

  constructor() {
    afterRenderEffect(() => {
      if (this.sent()) {
        this.sentHeading()?.nativeElement.focus();
      }
    });
  }

  protected async send(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.partnerForm, {
      action: async () => {
        this.sent.set(true);
        return undefined;
      },
      onInvalid: () => this.attempts.update((count) => count + 1),
    });
  }

  protected startAgain(): void {
    this.model.set({ ...this.blank });
    this.partnerForm().reset();
    this.attempts.set(0);
    this.sent.set(false);
  }
}
