import en from '../../content/en.json';

const RESPONSE_SENTENCE = 'We generally respond to initial requests within 5–7 business days.';

describe('English response-time copy', () => {
  const content = JSON.stringify(en);

  it('never promises a 10 business day reply', () => {
    expect(content).not.toContain('10 business days');
  });

  it('states the 5–7 business day response sentence where replies are described', () => {
    expect(content.split(RESPONSE_SENTENCE).length - 1).toBeGreaterThanOrEqual(3);
  });
});

describe('English insurance copy', () => {
  const insuranceAnswer = en.getHelp.questions.items.find(
    (item) => item.q === 'Do I need insurance, a referral or medical records?',
  )?.a;

  it('says insurance may be considered and each person is evaluated individually', () => {
    expect(insuranceAnswer).toContain('insurance may be considered');
    expect(insuranceAnswer).toContain('evaluated individually');
    expect(insuranceAnswer).toContain('medical need');
    expect(insuranceAnswer).toContain('financial circumstances');
    expect(insuranceAnswer).toContain('available resources');
    expect(insuranceAnswer).toContain('ability to safely provide care');
  });

  it('has no unknown or pending wording', () => {
    expect(insuranceAnswer?.toLowerCase()).not.toMatch(/unknown|pending/);
  });
});
