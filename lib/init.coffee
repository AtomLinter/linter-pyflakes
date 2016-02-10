helpers = null

module.exports =
  config:
    pyflakesExecutablePath:
      type: 'string'
      default: 'pyflakes'

  activate: ->
    require('atom-package-deps').install('linter-pyflakes')

  provideLinter: ->
    provider =
      name: 'pyflakes'
      grammarScopes: ['source.python']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) ->
        helpers ?= require('atom-linter')
        filePath = textEditor.getPath()

        return helpers.exec(atom.config.get(
          'linter-pyflakes.pyflakesExecutablePath'
        ), [], {stdin: textEditor.getText(), stream: 'both'}).then (result) ->
          toReturn = []

          if result.stderr
            regex = /.+:(\d+):(\d+):(.*)/g
            if (match = regex.exec(result.stderr)) isnt null
              line = parseInt(match[1]) or 0
              column = parseInt(match[2]) or 0
              toReturn.push({
                type: 'Error'
                text: match[3]
                filePath
                range: [[line - 1, column - 1], [line - 1, column - 1]]
              })

          else
            regex = /<stdin>:(\d+):(.*)/g
            while (match = regex.exec(result.stdout)) isnt null
              line = parseInt(match[1]) or 0
              toReturn.push({
                type: 'Warning'
                text: match[2]
                filePath
                # make range the full line
                range: helpers.rangeFromLineNumber(textEditor, line - 1)
              })
          return toReturn
