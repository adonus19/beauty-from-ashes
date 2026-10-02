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
import { FieldError } from '../../core/forms/field-error';
import { FormFieldA11y } from '../../core/forms/form-field-a11y';
import { JumpNav, JumpTarget } from '../../core/jump-nav/jump-nav';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

const PHONE = /^\D*(\d\D*){10,11}$/;

/** Refer someone: for pastors, clinicians, social workers, family and friends, with the referral form last. */
@Component({
  selector: 'bfa-refer',
  imports: [
    RouterLink,
    FormField,
    FormFieldA11y,
    FieldError,
    ErrorSummary,
    JumpNav,
    PlaceholderTag,
  ],
  templateUrl: './refer.html',
  styleUrl: './refer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Refer {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().refer);
  protected readonly forms = computed(() => this.locale.content().site.forms);
  protected readonly contact = computed(() => this.locale.content().site.contact);
  protected readonly placeholderNote = computed(() => this.locale.content().site.placeholder.note);

  protected readonly sections = computed<JumpTarget[]>(() => {
    const page = this.page();
    return [page.when, page.ask, page.next, page.partners, page.form].map(({ id, title }) => ({
      id,
      title,
    }));
  });

  private readonly blank = {
    yourFirst: '',
    yourLast: '',
    role: '',
    organization: '',
    yourEmail: '',
    yourPhone: '',
    personFirst: '',
    personLast: '',
    age: '',
    guardianName: '',
    personPhone: '',
    personEmail: '',
    city: '',
    state: '',
    careType: '',
    need: '',
    consent: false,
  };

  protected readonly model = signal({ ...this.blank });

  private readonly errors = this.locale.content().refer.errors;

  protected readonly referral = form(this.model, (s) => {
    const e = this.errors;
    required(s.yourFirst, { message: e.yourFirst });
    required(s.yourLast, { message: e.yourLast });
    required(s.role, { message: e.role });
    required(s.yourEmail, { message: e.yourEmail });
    email(s.yourEmail, { message: e.yourEmail });
    pattern(s.yourPhone, PHONE, { message: e.yourPhone });

    required(s.personFirst, { message: e.personFirst });
    required(s.personLast, { message: e.personLast });
    required(s.age, { message: e.age });
    hidden(s.guardianName, { when: ({ valueOf }) => valueOf(s.age) !== 'child' });
    required(s.guardianName, {
      message: e.guardianName,
      when: ({ valueOf }) => valueOf(s.age) === 'child',
    });
    required(s.personPhone, { message: e.personPhone });
    pattern(s.personPhone, PHONE, { message: e.personPhone });
    email(s.personEmail, { message: e.personEmail });
    required(s.city, { message: e.city });
    required(s.state, { message: e.state });

    required(s.careType, { message: e.careType });
    required(s.need, { message: e.need });
    validate(s.consent, ({ value }) =>
      value() ? undefined : { kind: 'required', message: e.consent },
    );
  });

  protected readonly forChild = computed(() => this.model().age === 'child');
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
    await submit(this.referral, {
      action: async () => {
        this.sent.set(true);
        return undefined;
      },
      onInvalid: () => this.attempts.update((count) => count + 1),
    });
  }

  protected startAgain(): void {
    this.model.set({ ...this.blank });
    this.referral().reset();
    this.attempts.set(0);
    this.sent.set(false);
  }
}
