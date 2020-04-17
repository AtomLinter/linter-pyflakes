'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';

let helpers;

const getMessageType = (line) => {
  if (
    line.includes('used')
    || line.includes('redefines')
    || line.includes('shadowed')
    || line.includes('may be')
  ) {
    return 'Warning';
  }
  return 'Error';
};

export default {
  activate() {
    require('atom-package-deps').install('linter-pyflakes');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.config.observe(
      'linter-pyflakes.pyflakesExecutablePath',
      (value) => { this.execPath = value; },
    ));
    this.subscriptions.add(atom.config.observe(
      'linter-pyflakes.lintTrigger',
      (value) => { this.lintTrigger = (value == "LintAsYouType"); },
    ));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'pyflakes',
      grammarScopes: ['source.python'],
      scope: 'file',
      lintsOnChange: this.lintTrigger,
      lint: async (textEditor) => {
        if (!helpers) {
          helpers = require('atom-linter');
        }
        const filePath = textEditor.getPath();
        const fileText = textEditor.getText();

        const execOpts = {
          stdin: fileText,
          stream: 'both',
        };
        const result = await helpers.exec(this.execPath, [], execOpts);
        if (textEditor.getText() !== fileText) {
          // File contents have changed since the run was triggered, don't update messages
          return null;
        }
        let regex;
        const toReturn = [];

        if (result.stderr) {
          regex = /.+:(\d+):(\d+): (.*)/g;
          const match = regex.exec(result.stderr);
          if (match !== null) {
            const line = parseInt(match[1], 10) - 1 || 0;
            const column = parseInt(match[2], 10) - 1 || 0;
            toReturn.push({
              severity: 'error',
              excerpt: match[3],
              location: {
                file: filePath,
                position: helpers.generateRange(textEditor, line, column),
              },
            });
          }
        } else {
          regex = /<stdin>:(\d+): (.*)/g;
          let match = regex.exec(result.stdout);
          while (match !== null) {
            const line = parseInt(match[1], 10) - 1 || 0;
            const type = getMessageType(match[2]);
            toReturn.push({
              severity: type.toLowerCase(),
              excerpt: match[2],
              location: {
                file: filePath,
                position: helpers.generateRange(textEditor, line),
              },
            });
            match = regex.exec(result.stdout);
          }
        }

        return toReturn;
      },
    };
  },
};
