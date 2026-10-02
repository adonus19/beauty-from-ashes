import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface JumpTarget {
  readonly id: string;
  readonly title: string;
}

/**
 * The "On this page" list of a reference page. The section being read is marked with a cobalt
 * brushed dab; following a link moves focus to that section so keyboard and screen reader users
 * land where they asked to go.
 */
@Component({
  selector: 'bfa-jump-nav',
  imports: [RouterLink],
  templateUrl: './jump-nav.html',
  styleUrl: './jump-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JumpNav {
  readonly label = input.required<string>();
  readonly targets = input.required<readonly JumpTarget[]>();

  protected readonly current = linkedSignal(() => this.targets()[0]?.id ?? '');

  private readonly document = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        return;
      }
      const inView = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              inView.add(entry.target.id);
            } else {
              inView.delete(entry.target.id);
            }
          }
          const reading = this.targets().find((target) => inView.has(target.id));
          if (reading) {
            this.current.set(reading.id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px' },
      );
      for (const target of this.targets()) {
        const section = this.document.getElementById(target.id);
        if (section) {
          observer.observe(section);
        }
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected follow(id: string): void {
    this.current.set(id);
    // The router scrolls to the fragment; focus follows so the next Tab starts inside the section.
    const section = this.document.getElementById(id);
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  }
}
