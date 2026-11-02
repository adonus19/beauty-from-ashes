import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TimeoutError, firstValueFrom, timeout } from 'rxjs';

import { Answers, SubmissionKind, toPayload } from './payload-format';
import { SUBMISSION_ENDPOINT, SubmissionError, SubmissionService } from './submission.service';

const TIMEOUT_MS = 30_000;
const SECURE = /^https:\/\/|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/;

/**
 * Posts the answers as JSON to the configured endpoint. Answers travel only in the request
 * body: never in the address, headers, console, storage or an error. With no endpoint it
 * sends nothing and says so, so the demo cannot be mistaken for a real send.
 */
@Injectable({ providedIn: 'root' })
export class HttpSubmissionService extends SubmissionService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = inject(SUBMISSION_ENDPOINT).trim();

  readonly live = this.endpoint !== '';

  async submit(kind: SubmissionKind, answers: Answers): Promise<'sent' | 'demo'> {
    if (!this.live) return 'demo';
    if (!SECURE.test(this.endpoint)) throw new SubmissionError('insecure');

    try {
      await firstValueFrom(
        this.http
          .post(this.endpoint, toPayload(kind, answers), { withCredentials: false })
          .pipe(timeout(TIMEOUT_MS)),
      );
      return 'sent';
    } catch (error) {
      // Only the kind of failure is kept: the original error can echo the request.
      if (error instanceof TimeoutError) throw new SubmissionError('timeout');
      if (error instanceof HttpErrorResponse && error.status > 0) {
        throw new SubmissionError('server');
      }
      throw new SubmissionError('network');
    }
  }
}
