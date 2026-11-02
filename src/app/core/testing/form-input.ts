/** Fills a control the way a visitor would, so the form sees input and change events. */
export function typeInto(page: HTMLElement, selector: string, value: string): void {
  const el = page.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    selector,
  )!;
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

export function choose(page: HTMLElement, selector: string): void {
  page.querySelector<HTMLInputElement>(selector)!.click();
}

/** Waits for a pending send to settle and the page to render the result. */
export async function settle(fixture: { whenStable(): Promise<unknown> }): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve));
  await fixture.whenStable();
}
