'use babel';

import { join } from 'path';

const validPath = join(__dirname, 'fixtures', 'valid.py');
const invalidPath = join(__dirname, 'fixtures', 'invalid.py');
const syntaxPath = join(__dirname, 'fixtures', 'invalid_syntax.py');
const { lint } = require('../lib/init').provideLinter();

describe('The pyflakes provider for Linter', () => {
  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => atom.packages.activatePackage('linter-pyflakes'));
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-pyflakes')).toBe(true));

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-pyflakes')).toBe(true));

  it('finds nothing wrong with valid files', () =>
    waitsForPromise(() =>
      atom.workspace.open(validPath).then(editor =>
        lint(editor).then(messages =>
          expect(messages.length).toBe(0),
        ),
      ),
    ),
  );

  it('finds something wrong with invalid files', () =>
    waitsForPromise(() =>
      atom.workspace.open(invalidPath).then(editor =>
        lint(editor).then((messages) => {
          expect(messages.length).toBe(2);

          expect(messages[0].type).toBe('Warning');
          expect(messages[0].severity).toBe('warning');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].text).toBe("'os' imported but unused");
          expect(messages[0].filePath).toBe(invalidPath);
          expect(messages[0].range).toEqual([[0, 0], [0, 9]]);

          expect(messages[1].type).toBe('Error');
          expect(messages[1].severity).toBe('error');
          expect(messages[1].html).not.toBeDefined();
          expect(messages[1].text).toBe("undefined name 'hello_world'");
          expect(messages[1].filePath).toBe(invalidPath);
          expect(messages[1].range).toEqual([[4, 4], [4, 22]]);
        }),
      ),
    ),
  );

  it('finds something wrong with invalid syntax', () =>
    waitsForPromise(() =>
      atom.workspace.open(syntaxPath).then(editor =>
        lint(editor).then((messages) => {
          expect(messages.length).toBe(1);

          expect(messages[0].type).toBe('Error');
          expect(messages[0].severity).toBe('error');
          expect(messages[0].html).not.toBeDefined();
          expect(messages[0].text).toBe('invalid syntax');
          expect(messages[0].filePath).toBe(syntaxPath);
          expect(messages[0].range).toEqual([[0, 7], [0, 8]]);
        }),
      ),
    ),
  );
});
