export type SubmissionKind = 'request' | 'referral';

export type Answers = Readonly<Record<string, string | boolean>>;

export interface SubmissionPayload {
  form: SubmissionKind;
  fields: Record<string, string | boolean>;
}

interface FieldRule {
  /** The name the receiving service knows this answer by. */
  name: string;
  /** Sent only when this holds, so an answer hidden by a later choice is not sent. */
  when?: (answers: Answers) => boolean;
}

const same = (name: string, when?: FieldRule['when']): FieldRule => ({ name, when });
const forChild = (answers: Answers) => answers['forWhom'] === 'child';
const ageChild = (answers: Answers) => answers['age'] === 'child';

/**
 * Everything the site sends, and the only place that decides how. Keys are the form's own
 * answer names; `name` is the wire name. Answers not listed here are never sent.
 *
 * UNVERIFIED: this is a neutral JSON shape, `{ form, fields }`, not Paubox's documented
 * request body. Connecting Paubox means checking its live docs (docs.paubox.com/forms) and
 * changing this file only: the wire names below and the shape `toPayload` returns.
 */
const FIELD_MAP: Record<SubmissionKind, Record<string, FieldRule>> = {
  request: {
    forWhom: same('forWhom'),
    patientFirst: same('patientFirst'),
    patientLast: same('patientLast'),
    guardianFirst: same('guardianFirst', forChild),
    guardianLast: same('guardianLast', forChild),
    guardianRelation: same('guardianRelation', forChild),
    phone: same('phone'),
    email: same('email'),
    contactMethod: same('contactMethod'),
    safeMessage: same('safeMessage'),
    language: same('language'),
    city: same('city'),
    state: same('state'),
    zip: same('zip'),
    careType: same('careType'),
    description: same('description'),
    prayer: same('prayer'),
    consentContact: same('consentContact'),
    consentAuthority: same('consentAuthority'),
  },
  referral: {
    yourFirst: same('yourFirst'),
    yourLast: same('yourLast'),
    role: same('role'),
    organization: same('organization'),
    yourEmail: same('yourEmail'),
    yourPhone: same('yourPhone'),
    personFirst: same('personFirst'),
    personLast: same('personLast'),
    age: same('age'),
    guardianName: same('guardianName', ageChild),
    personPhone: same('personPhone'),
    personEmail: same('personEmail'),
    city: same('city'),
    state: same('state'),
    careType: same('careType'),
    need: same('need'),
    consent: same('consent'),
  },
};

/** Turns the form's answers into the body that is posted. Blank answers are left out. */
export function toPayload(kind: SubmissionKind, answers: Answers): SubmissionPayload {
  const fields: SubmissionPayload['fields'] = {};
  for (const [key, rule] of Object.entries(FIELD_MAP[kind])) {
    const value = answers[key];
    if (value === undefined || value === '') continue;
    if (rule.when && !rule.when(answers)) continue;
    fields[rule.name] = value;
  }
  return { form: kind, fields };
}
