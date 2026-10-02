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

/** Contact: the ministry's details and a general message form that asks for no health details. */
@Component({
  selector: 'bfa-contact',
  imports: [RouterLink, FormField, FormFieldA11y, FieldError, ErrorSummary, PlaceholderTag],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-block' },
})
export class Contact {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().contact);
  protected readonly site = computed(() => this.locale.content().site);

  private readonly blank = { name: '', email: '', phone: '', topic: '', message: '' };
  protected readonly model = signal({ ...this.blank });

  private readonly errors = this.locale.content().contact.errors;

  protected readonly messageForm = form(this.model, (s) => {
    const e = this.errors;
    required(s.name, { message: e.name });
    required(s.email, { message: e.email });
    email(s.email, { message: e.email });
    pattern(s.phone, /^\D*(\d\D*){10,11}$/, { message: e.phone });
    required(s.topic, { message: e.topic });
    required(s.message, { message: e.message });
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
    await submit(this.messageForm, {
      action: async () => {
        this.sent.set(true);
        return undefined;
      },
      onInvalid: () => this.attempts.update((count) => count + 1),
    });
  }

  protected startAgain(): void {
    this.model.set({ ...this.blank });
    this.messageForm().reset();
    this.attempts.set(0);
    this.sent.set(false);
  }
}
