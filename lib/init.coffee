module.exports =
  config:
    pyflakesExecutablePath:
      type: 'string'
      default: 'pyflakes'

  activate: ->

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      grammarScopes: ['source.python']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor)->
        filePath = textEditor.getPath()

        return helpers.exec(atom.config.get(
          'linter-pyflakes.pyflakesExecutablePath'
        ), [], {stdin: textEditor.getText()}).then (result) ->

          toReturn = []
          regex = /<stdin>:(\d+):(.*)/g
          while (match = regex.exec(result)) isnt null
            line = parseInt(match[1]) or 0
            toReturn.push({
              type: 'Warning'
              text: match[2]
              filePath
              range: [[line - 1, 0], [line - 1, 1]]
            })
          return toReturn
