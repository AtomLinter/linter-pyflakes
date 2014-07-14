linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"

class LinterPyflakes extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: 'source.python'

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: 'pyflakes'

  executablePath: null

  linterName: 'pyflakes'

  # A regex pattern used to extract information from the executable's output.
  # regex: ""/path/to/python/file.py:28: redefinition of unused 'models' from line 5"
  regex: ':(?<line>\\d+): (?<message>.*?)\n'

  constructor: (editor)->
    super editor
    @executablePath = atom.config.get 'linter-pyflakes.pyflakesExecutablePath'

module.exports = LinterPyflakes
