import { Provider } from '@angular/core';

import { Answers, SubmissionKind } from '../submission/payload-format';
import { SubmissionError, SubmissionService } from '../submission/submission.service';

/**
 * A submission service for specs. Each send waits until the spec settles it, so a spec can
 * look at the page while a send is in flight. With `live` false it answers `'demo'` at once.
 */
export class FakeSubmission extends SubmissionService {
  live = true;
  readonly calls: { kind: SubmissionKind; answers: Answers }[] = [];
  private pending: { resolve: () => void; reject: (error: unknown) => void }[] = [];

  async submit(kind: SubmissionKind, answers: Answers): Promise<'sent' | 'demo'> {
    this.calls.push({ kind, answers });
    if (!this.live) return 'demo';
    await new Promise<void>((resolve, reject) => this.pending.push({ resolve, reject }));
    return 'sent';
  }

  succeed(): void {
    this.pending.shift()?.resolve();
  }

  fail(reason: 'network' | 'server' = 'network'): void {
    this.pending.shift()?.reject(new SubmissionError(reason));
  }
}

export function fakeSubmission(live = true): { fake: FakeSubmission; provider: Provider } {
  const fake = new FakeSubmission();
  fake.live = live;
  return { fake, provider: { provide: SubmissionService, useValue: fake } };
}
