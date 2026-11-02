import { toPayload } from './payload-format';

describe('toPayload', () => {
  it('wraps the answers as plain JSON naming the form', () => {
    const payload = toPayload('request', {
      forWhom: 'self',
      patientFirst: 'Sam',
      consentContact: true,
    });
    expect(JSON.parse(JSON.stringify(payload))).toEqual({
      form: 'request',
      fields: { forWhom: 'self', patientFirst: 'Sam', consentContact: true },
    });
  });

  it('leaves out blank answers', () => {
    const payload = toPayload('request', { patientFirst: 'Sam', zip: '', email: '' });
    expect(payload.fields).toEqual({ patientFirst: 'Sam' });
  });

  it('sends the parent or guardian only when the request is for a child', () => {
    const answers = { guardianFirst: 'Ana', guardianRelation: 'parent' };
    expect(toPayload('request', { forWhom: 'self', ...answers }).fields).toEqual({
      forWhom: 'self',
    });
    expect(toPayload('request', { forWhom: 'child', ...answers }).fields).toEqual({
      forWhom: 'child',
      ...answers,
    });
  });

  it('sends a referral guardian name only when the person is a child', () => {
    expect(toPayload('referral', { age: 'adult', guardianName: 'Ana' }).fields).toEqual({
      age: 'adult',
    });
    expect(toPayload('referral', { age: 'child', guardianName: 'Ana' }).fields).toEqual({
      age: 'child',
      guardianName: 'Ana',
    });
  });

  it('drops answers the field map does not list', () => {
    const payload = toPayload('referral', { personFirst: 'Sam', somethingNew: 'x' });
    expect(payload.fields).toEqual({ personFirst: 'Sam' });
  });
});
