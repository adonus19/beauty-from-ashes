import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

interface Photo {
  readonly name: string;
  readonly size: string;
  readonly url: string;
}

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

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
  protected readonly steps = computed(() => this.locale.content().home.process.steps);

  protected readonly model = signal({
    forWhom: '',
    patientFirst: '',
    patientLast: '',
    patientBirth: '',
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
    howLong: '',
    dailyLife: '',
    photoNames: [] as string[],
    insurance: '',
    heardFrom: '',
    prayer: '',
    notes: '',
    consentContact: false,
    consentAuthority: false,
  });

  private readonly errors = this.locale.content().askForHelp.errors;

  protected readonly request = form(this.model, (s) => {
    const e = this.errors;

    required(s.forWhom, { message: e.forWhom });
    required(s.patientFirst, { message: e.patientFirst });
    required(s.patientLast, { message: e.patientLast });
    required(s.patientBirth, { message: e.patientBirth });
    pattern(s.patientBirth, /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/, {
      message: e.patientBirth,
    });

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
    required(s.dailyLife, { message: e.dailyLife });
    validate(s.photoNames, ({ value }) =>
      value().length ? undefined : { kind: 'required', message: e.photos },
    );

    validate(s.consentContact, ({ value }) =>
      value() ? undefined : { kind: 'required', message: e.consentContact },
    );
    validate(s.consentAuthority, ({ value }) =>
      value() ? undefined : { kind: 'required', message: e.consentAuthority },
    );
  });

  protected readonly isSelf = computed(() => this.model().forWhom === 'self');
  protected readonly forChild = computed(() => this.model().forWhom === 'child');

  protected readonly photos = signal<readonly Photo[]>([]);
  protected readonly photoNotice = signal('');
  protected readonly attempts = signal(0);
  protected readonly sent = signal(false);

  private readonly photoInput = viewChild<ElementRef<HTMLInputElement>>('photoInput');
  private readonly sentHeading = viewChild<ElementRef<HTMLElement>>('sentHeading');

  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.photos().forEach((photo) => URL.revokeObjectURL(photo.url)),
    );

    afterRenderEffect(() => {
      if (this.sent()) {
        this.sentHeading()?.nativeElement.focus();
      }
    });
  }

  protected addPhotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const text = this.page().fields.photos;
    const added = [...this.photos()];
    const notes: string[] = [];

    for (const file of Array.from(input.files ?? [])) {
      if (!file.type.startsWith('image/')) {
        notes.push(`${file.name} ${text.notImage}`);
      } else if (file.size > MAX_PHOTO_BYTES) {
        notes.push(`${file.name} ${text.tooBig}`);
      } else if (added.length >= MAX_PHOTOS) {
        notes.push(text.tooMany);
        break;
      } else {
        added.push({
          name: file.name,
          size: formatSize(file.size),
          url: URL.createObjectURL(file),
        });
      }
    }

    input.value = '';
    this.photoNotice.set(notes.join(' '));
    this.setPhotos(added);
  }

  protected removePhoto(index: number): void {
    const photo = this.photos()[index];
    URL.revokeObjectURL(photo.url);
    this.photoNotice.set('');
    this.setPhotos(this.photos().filter((_, i) => i !== index));
    this.photoInput()?.nativeElement.focus();
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

  private setPhotos(photos: readonly Photo[]): void {
    this.photos.set(photos);
    this.model.update((model) => ({ ...model, photoNames: photos.map((photo) => photo.name) }));
    this.request.photoNames().markAsTouched();
  }
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
