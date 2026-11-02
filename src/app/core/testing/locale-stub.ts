import { signal } from '@angular/core';

import en from '../../../content/en.json';
import { Locale } from '../locale';

/** A Locale for specs that need to set contact details the real content leaves blank. */
export function localeWith(details: { email?: string; ein?: string; addressMapHref?: string }) {
  const content = structuredClone(en);
  if (details.email !== undefined) content.site.contact.email = details.email;
  if (details.addressMapHref !== undefined)
    content.site.contact.addressMapHref = details.addressMapHref;
  if (details.ein !== undefined) content.site.legal.ein = details.ein;
  return {
    provide: Locale,
    useValue: {
      content: signal(content),
      code: signal('en'),
      link: (path = '') => `/${path}`,
      alternate: () => '/',
    },
  };
}
