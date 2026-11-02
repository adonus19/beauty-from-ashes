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
import {
  FormField,
  email,
  form,
  hidden,
  pattern,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { ErrorSummary } from '../../core/forms/error-summary';
import { careTypeOptions } from '../../core/forms/care-type-options';
import { FieldError } from '../../core/forms/field-error';
import { FormFieldA11y } from '../../core/forms/form-field-a11y';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

/**
 * The request for care. On the demo nothing leaves the browser: a valid request shows the
 * confirmation and is discarded. The secure, HIPAA-compliant service is connected before launch.
 */
@Component({
  selector: 'bfa-ask-for-help',
  imports: [RouterLink, FormField, FormFieldA11y, FieldError, ErrorSummary, PlaceholderTag],
  templateUrl: './ask-for-help.html',
  styleUrl: './ask-for-help.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AskForHelp {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().askForHelp);
  protected readonly forms = computed(() => this.locale.content().site.forms);
  protected readonly contact = computed(() => this.locale.content().site.contact);
  protected readonly careTypes = computed(() =>
    careTypeOptions(this.locale.content(), this.page().fields.careType),
  );
  protected readonly steps = computed(() => this.locale.content().home.process.steps);

  protected readonly model = signal({
    forWhom: '',
    patientFirst: '',
    patientLast: '',
    guardianFirst: '',
    guardianLast: '',
    guardianRelation: '',
    phone: '',
    email: '',
    contactMethod: '',
    safeMessage: '',
    language: 'en',
    city: '',
    state: '',
    zip: '',
    careType: '',
    description: '',
    prayer: '',
    consentContact: false,
    consentAuthority: false,
  });

  private readonly errors = this.locale.content().askForHelp.errors;

  protected readonly request = form(this.model, (s) => {
    const e = this.errors;

    required(s.forWhom, { message: e.forWhom });
    required(s.patientFirst, { message: e.patientFirst });
    required(s.patientLast, { message: e.patientLast });

    // A parent or guardian answers for a child, so their own details are asked only then.
    for (const path of [s.guardianFirst, s.guardianLast, s.guardianRelation]) {
      hidden(path, { when: ({ valueOf }) => valueOf(s.forWhom) !== 'child' });
    }
    required(s.guardianFirst, {
      message: e.guardianFirst,
      when: ({ valueOf }) => valueOf(s.forWhom) === 'child',
    });
    required(s.guardianLast, {
      message: e.guardianLast,
      when: ({ valueOf }) => valueOf(s.forWhom) === 'child',
    });
    required(s.guardianRelation, {
      message: e.guardianRelation,
      when: ({ valueOf }) => valueOf(s.forWhom) === 'child',
    });

    required(s.phone, { message: e.phone });
    pattern(s.phone, /^\D*(\d\D*){10,11}$/, { message: e.phone });
    email(s.email, { message: e.email });
    required(s.email, {
      message: e.emailNeeded,
      when: ({ valueOf }) => valueOf(s.contactMethod) === 'email',
    });
    required(s.contactMethod, { message: e.contactMethod });
    required(s.safeMessage, { message: e.safeMessage });

    required(s.city, { message: e.city });
    required(s.state, { message: e.state });

    required(s.careType, { message: e.careType });
    required(s.description, { message: e.description });

    validate(s.consentContact, ({ value }) =>
      value() ? undefined : { kind: 'required', message: e.consentContact },
    );
    validate(s.consentAuthority, ({ value }) =>
      value() ? undefined : { kind: 'required', message: e.consentAuthority },
    );
  });

  protected readonly isSelf = computed(() => this.model().forWhom === 'self');
  protected readonly forChild = computed(() => this.model().forWhom === 'child');

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
    await submit(this.request, {
      action: async () => {
        this.sent.set(true);
        return undefined;
      },
      onInvalid: () => this.attempts.update((count) => count + 1),
    });
  }

}
