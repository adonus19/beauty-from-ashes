import { computed, inject, signal } from '@angular/core';

import { Answers, SubmissionKind } from './payload-format';
import { SubmissionService } from './submission.service';

export type SubmitStatus = 'idle' | 'sending' | 'sent' | 'failed';

/**
 * Where one form is in sending. A send already under way is never started twice. A failed
 * send leaves the form as it was, so the visitor can try again without retyping anything.
 * Holds no answers: they are passed through and not kept.
 */
export class FormSubmission {
  private readonly service = inject(SubmissionService);

  /** False while no secure service is connected: nothing is sent and the demo notice stays. */
  readonly live = this.service.live;
  readonly status = signal<SubmitStatus>('idle');
  readonly sending = computed(() => this.status() === 'sending');
  readonly sent = computed(() => this.status() === 'sent');

  constructor(private readonly kind: SubmissionKind) {}

  async send(answers: Answers): Promise<void> {
    if (this.sending()) return;
    this.status.set('sending');
    try {
      await this.service.submit(this.kind, answers);
      this.status.set('sent');
    } catch {
      // The reason is not kept or logged: it adds nothing the visitor can act on.
      this.status.set('failed');
    }
  }

  reset(): void {
    this.status.set('idle');
  }
}

/** Call from a field initializer, where `inject` is available. */
export function formSubmission(kind: SubmissionKind): FormSubmission {
  return new FormSubmission(kind);
}
