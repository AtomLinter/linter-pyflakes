linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{log, warn} = require "#{linterPath}/lib/utils"
{BufferedProcess} = require 'atom'

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
  regex: ':(?<line>\\d+):[(?<col>\\d+):]* (?<message>.*?)\n'

  constructor: (editor)->
    super editor
    @executablePath = atom.config.get 'linter-pyflakes.pyflakesExecutablePath'

  lintFile: (filePath, callback) ->
    # build the command with arguments to lint the file
    {command, args} = @getCmdAndArgs(filePath)

    log 'is node executable: ' + @isNodeExecutable

    # options for BufferedProcess, same syntax with child_process.spawn
    options = {cwd: @cwd}

    dataStdout = []
    dataStderr = []
    exited = false

    stdout = (output) ->
      log 'stdout', output
      dataStdout += output

    stderr = (output) ->
      warn 'stderr', output
      dataStderr += output

    exit = =>
      exited = true
      data = dataStdout + dataStderr
      @processMessage data, callback

    process = new BufferedProcess({command, args, options,
                                  stdout, stderr, exit})

    # Kill the linter process if it takes too long
    if @executionTimeout > 0
      setTimeout =>
        return if exited
        process.kill()
        warn "command `#{command}` timed out after #{@executionTimeout} ms"
      , @executionTimeout

module.exports = LinterPyflakes
