import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Lets the cobalt brushstrokes inside a section draw themselves on as the section scrolls into view.
 * The strokes are painted by default; only sections still below the fold are armed, and nothing is
 * armed when the visitor prefers reduced motion.
 */
@Directive({
  selector: '[bfaBrushReveal]',
})
export class BrushReveal {
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || !('IntersectionObserver' in window)) {
        return;
      }
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
        return;
      }

      element.classList.add('is-armed');
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            element.classList.add('is-drawn');
            observer.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
