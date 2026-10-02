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

import { BrushReveal } from '../../core/brush-reveal';
import { ErrorSummary } from '../../core/forms/error-summary';
import { FieldError } from '../../core/forms/field-error';
import { FormFieldA11y } from '../../core/forms/form-field-a11y';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

/** Volunteer: the card's Vision first, then where a clinician's skills fit and how to join. */
@Component({
  selector: 'bfa-volunteer',
  imports: [RouterLink, BrushReveal, FormField, FormFieldA11y, FieldError, ErrorSummary, PlaceholderTag],
  templateUrl: './volunteer.html',
  styleUrl: './volunteer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Volunteer {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().volunteer);
  protected readonly forms = computed(() => this.locale.content().site.forms);
  protected readonly placeholderNote = computed(() => this.locale.content().site.placeholder.note);

  private readonly blank = {
    first: '',
    last: '',
    email: '',
    phone: '',
    role: '',
    license: '',
    weekdays: false,
    weekends: false,
    fewTimes: false,
    regular: false,
    message: '',
  };

  protected readonly model = signal({ ...this.blank });

  private readonly errors = this.locale.content().volunteer.errors;

  protected readonly signup = form(this.model, (s) => {
    const e = this.errors;
    required(s.first, { message: e.first });
    required(s.last, { message: e.last });
    required(s.email, { message: e.email });
    email(s.email, { message: e.email });
    pattern(s.phone, /^\D*(\d\D*){10,11}$/, { message: e.phone });
    required(s.role, { message: e.role });
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
    await submit(this.signup, {
      action: async () => {
        this.sent.set(true);
        return undefined;
      },
      onInvalid: () => this.attempts.update((count) => count + 1),
    });
  }

  protected startAgain(): void {
    this.model.set({ ...this.blank });
    this.signup().reset();
    this.attempts.set(0);
    this.sent.set(false);
  }
}
