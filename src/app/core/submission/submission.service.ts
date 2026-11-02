import { InjectionToken } from '@angular/core';

import type { SubmissionKind } from './payload-format';

export type { SubmissionKind } from './payload-format';

/**
 * The address that receives requests and referrals. Empty until the ministry has a signed
 * business associate agreement with the form service; see `appConfig` for where to set it.
 */
export const SUBMISSION_ENDPOINT = new InjectionToken<string>('SUBMISSION_ENDPOINT', {
  providedIn: 'root',
  factory: () => '',
});

/** Why a send failed. Never carries anything the visitor typed. */
export type SubmissionFailure = 'network' | 'server' | 'timeout' | 'insecure';

export class SubmissionError extends Error {
  constructor(readonly reason: SubmissionFailure) {
    super(`Submission failed: ${reason}`);
    this.name = 'SubmissionError';
  }
}

/**
 * Sends a request or referral to the secure form service. `submit` resolves `'sent'` once the
 * service accepted it, `'demo'` when no service is connected (nothing left the browser), and
 * rejects with a `SubmissionError` otherwise. The app provides `HttpSubmissionService` for it
 * in `appConfig`; specs provide a fake.
 */
export abstract class SubmissionService {
  /** True when a real service is connected. While false, nothing is ever sent. */
  abstract readonly live: boolean;
  abstract submit(
    kind: SubmissionKind,
    answers: Readonly<Record<string, string | boolean>>,
  ): Promise<'sent' | 'demo'>;
}
