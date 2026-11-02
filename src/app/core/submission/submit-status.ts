import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

import { Locale } from '../locale';
import { SubmitStatus } from './form-submission';

/**
 * Tells the visitor how sending is going. Keep it in the page for the whole life of the form,
 * outside any block that is swapped out when the form is sent: a live region has to exist
 * before its text changes, or screen readers miss the announcement. When a send fails, focus
 * moves to "Try again", and then to the status message while that retry is sent.
 */
@Component({
  selector: 'bfa-submit-status',
  template: `
    <div
      #box
      class="submit-status"
      tabindex="-1"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      @switch (status()) {
        @case ('sending') {
          <p class="submit-status__text">{{ text().sending }}</p>
        }
        @case ('failed') {
          <p class="submit-status__text submit-status__text--failed">{{ text().failed }}</p>
          <p class="submit-status__text">
            {{ text().failedHelp }}
            <a class="brush-link" [href]="contact().phoneHref">{{ contact().phone }}</a
            >.
          </p>
        }
        @case ('sent') {
          <span class="visually-hidden">{{ sentMessage() }}</span>
        }
      }
    </div>
    @if (status() === 'failed') {
      <button #retryButton class="submit-status__retry btn-line" type="button" (click)="retryNow()">
        {{ text().retry }}
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitStatusView {
  readonly status = input.required<SubmitStatus>();
  /** What a screen reader hears once the send has gone through. */
  readonly sentMessage = input.required<string>();
  readonly retry = output<void>();

  private readonly locale = inject(Locale);
  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');
  private readonly retryButton = viewChild<ElementRef<HTMLButtonElement>>('retryButton');

  protected readonly text = computed(() => this.locale.content().site.forms);
  protected readonly contact = computed(() => this.locale.content().site.contact);

  /** The button goes away while the retry is sent, so focus waits on the status message. */
  protected retryNow(): void {
    this.box().nativeElement.focus();
    this.retry.emit();
  }

  constructor() {
    afterRenderEffect(() => {
      this.retryButton()?.nativeElement.focus();
    });
  }
}
