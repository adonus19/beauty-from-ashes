import en from '../../content/en.json';

describe('English respectful wording', () => {
  const content = JSON.stringify(en).toLowerCase();

  it('never uses banned phrases', () => {
    for (const phrase of ['disfiguring', 'disfigured', 'fix you', 'fix a person', 'fixing people']) {
      expect(content).not.toContain(phrase);
    }
  });

  it('does not talk about correcting or repairing a person', () => {
    expect(content).not.toContain('correcting physical differences');
  });
});
