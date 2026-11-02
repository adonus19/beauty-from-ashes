export interface CareTypeOption {
  readonly value: string;
  readonly label: string;
}

interface CareTypeSource {
  readonly home: { readonly conditions: { readonly items: readonly { readonly name: string }[] } };
}

/**
 * The care-type choices for both forms: the conditions listed on the home and Get Help pages
 * (`home.conditions`, the single source), then an "Other / not sure" choice.
 */
export function careTypeOptions(
  content: CareTypeSource,
  labels: { readonly placeholder: string; readonly other: string },
): CareTypeOption[] {
  return [
    { value: '', label: labels.placeholder },
    ...content.home.conditions.items.map(({ name }) => ({ value: name, label: name })),
    { value: labels.other, label: labels.other },
  ];
}
