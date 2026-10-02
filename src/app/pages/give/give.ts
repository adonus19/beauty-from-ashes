import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, form, pattern, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { FieldError } from '../../core/forms/field-error';
import { FormFieldA11y } from '../../core/forms/form-field-a11y';
import { Locale } from '../../core/locale';
import { PlaceholderTag } from '../../core/placeholder-tag/placeholder-tag';

/**
 * Give: the gift under the ministry's own glaze. Until the Stripe account exists the form
 * charges nothing and says so; on launch the Give button opens Stripe's hosted checkout.
 */
@Component({
  selector: 'bfa-give',
  imports: [RouterLink, FormField, FormFieldA11y, FieldError, PlaceholderTag],
  templateUrl: './give.html',
  styleUrl: './give.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Give {
  protected readonly locale = inject(Locale);
  protected readonly page = computed(() => this.locale.content().give);
  protected readonly placeholderNote = computed(() => this.locale.content().site.placeholder.note);

  protected readonly model = signal({ frequency: 'once', amount: '100', other: '' });

  private readonly text = this.locale.content().give.form;

  protected readonly gift = form(this.model, (s) => {
    required(s.other, {
      message: this.text.otherError,
      when: ({ valueOf }) => valueOf(s.amount) === 'other',
    });
    pattern(s.other, /^\s*\$?\s*([5-9]|[1-9]\d{1,5})(\.\d{2})?\s*$/, { message: this.text.otherError });
  });

  /** The amount in dollars, or null while "Other amount" is still empty or invalid. */
  protected readonly dollars = computed(() => {
    const { amount, other } = this.model();
    if (amount !== 'other') {
      return Number(amount);
    }
    const value = Number(other.replace(/[$\s,]/g, ''));
    return Number.isFinite(value) && value >= 5 ? value : null;
  });

  protected readonly giftLabel = computed(() => {
    const dollars = this.dollars();
    const shown = dollars === null ? '' : `$${dollars.toLocaleString('en-US')}`;
    const template = this.model().frequency === 'monthly' ? this.text.giveMonthly : this.text.giveOnce;
    return template.replace('${amount}', shown).replace(/\s+/g, ' ').trim();
  });

  protected readonly result = signal('');

  protected async give(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.gift, {
      action: async () => {
        this.result.set(this.text.result.replace('{gift}', this.giftLabel().replace(/^Give /, '')));
        return undefined;
      },
    });
  }
}
