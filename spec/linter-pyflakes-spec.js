'use babel';

// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';
import { join } from 'path';

const validPath = join(__dirname, 'fixtures', 'valid.py');
const invalidPath = join(__dirname, 'fixtures', 'invalid.py');
const syntaxPath = join(__dirname, 'fixtures', 'invalid_syntax.py');
const { lint } = require('../lib/init').provideLinter();

describe('The pyflakes provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-pyflakes');
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-pyflakes')).toBe(true));

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-pyflakes')).toBe(true));

  it('finds nothing wrong with valid files', async () => {
    const editor = await atom.workspace.open(validPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  it('finds something wrong with invalid files', async () => {
    const editor = await atom.workspace.open(invalidPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(2);

    expect(messages[0].severity).toBe('warning');
    expect(messages[0].html).not.toBeDefined();
    expect(messages[0].excerpt).toBe("'os' imported but unused");
    expect(messages[0].location.file).toBe(invalidPath);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 9]]);

    expect(messages[1].severity).toBe('error');
    expect(messages[1].html).not.toBeDefined();
    expect(messages[1].excerpt).toBe("undefined name 'hello_world'");
    expect(messages[1].location.file).toBe(invalidPath);
    expect(messages[1].location.position).toEqual([[4, 4], [4, 22]]);
  });

  it('finds something wrong with invalid syntax', async () => {
    const editor = await atom.workspace.open(syntaxPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(1);

    expect(messages[0].severity).toBe('error');
    expect(messages[0].html).not.toBeDefined();
    expect(messages[0].excerpt).toBe('invalid syntax');
    expect(messages[0].location.file).toBe(syntaxPath);
    expect(messages[0].location.position).toEqual([[0, 7], [0, 8]]);
  });
});
